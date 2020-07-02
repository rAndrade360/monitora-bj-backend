module.exports = (table) => `
CREATE TRIGGER  trg_tabela_log AFTER UPDATE 
ON ${table} FOR EACH ROW 
    EXECUTE PROCEDURE on_update_table();
`;
