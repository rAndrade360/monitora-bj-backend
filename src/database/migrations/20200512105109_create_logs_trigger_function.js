const CUSTOM_FUNCTIONS = `
CREATE OR REPLACE FUNCTION on_update_table()   
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    ri RECORD;
    campo_novo TEXT;
    campo_antigo TEXT;
BEGIN
FOR ri IN
        SELECT  column_name
        FROM information_schema.columns
        WHERE
            table_schema = quote_ident(TG_TABLE_SCHEMA)
        AND table_name = quote_ident(TG_TABLE_NAME)
        ORDER BY ordinal_position
    LOOP
    if ( TG_OP = 'UPDATE') then		
	
		Execute 'SELECT ($1).' || ri.column_name || '::text' into campo_antigo using old;
		Execute 'SELECT ($1).' || ri.column_name || '::text' into campo_novo using NEW;

		if campo_novo <> campo_antigo then
      INSERT INTO patient_logs (patient_id, field_name, table_name, old_value, new_value) values 
						(old.patient_id, ri.column_name, quote_ident(TG_relname), campo_antigo, campo_novo);
                end if;
        end if;       
        

    END LOOP;
    RETURN NEW;
END;
$$;
`;

const DROP_CUSTOM_FUNCTIONS = `DROP FUNCTION on_update_table()`;

exports.up = async (knex) => knex.raw(CUSTOM_FUNCTIONS);

exports.down = async (knex) => knex.raw(DROP_CUSTOM_FUNCTIONS);
