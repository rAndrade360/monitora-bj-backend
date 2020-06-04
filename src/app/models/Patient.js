const connection = require('../../database/connection');
const Patient = () => {

    const store = async (patient, address, fixed_report) => {
        let patientId
        try {
            await connection.transaction(async trx => {
                patientId = await connection('patients').insert({
                    name: patient.name,
                    cpf: patient.cpf,
                    phone_number: patient.phone_number,
                    genre: patient.genre,
                    birthday: new Date(patient.birthday),
                    screening_day: new Date(patient.screening_day),
                    risk: patient.risk,
                    status: patient.status,
                    password: patient.password
                }).transacting(trx);
                address.patient_id = patientId[0];
                await connection('addresses').insert(address).transacting(trx);
                fixed_report.patient_id = patientId[0];
                await connection('fixed_reports').insert(fixed_report).transacting(trx);
            })
        } catch (err) {
            throw err
        }
        return patientId;
    }

    const listAll = async (page = 1, name) => {
        let patients
	let count = 0;
        try {
	    count = await connection('patients').count();
            let query = connection('patients')
                .join('addresses', 'patients.id', '=', 'addresses.patient_id')
                .join('fixed_reports', 'patients.id', '=', 'fixed_reports.patient_id')
                .select(
		    'patients.id',
                    'patients.name',
                    'patients.cpf',
                    'patients.phone_number',
                    'patients.genre',
                    'patients.birthday',
                    'patients.screening_day',
                    'patients.risk',
                    'patients.status',
                    'addresses.address',
                    'addresses.street',
                    'addresses.number',
                    'addresses.complement',
                    'fixed_reports.recent_travel',
                    'fixed_reports.traveled_to_city',
                    'fixed_reports.recent_contact'
		)
		.limit(10).offset((page-1)*10);
		if(name){
			query.andWhere('name', 'like', `%${name}%`)		
		}
		patients = await query;
        } catch (err) {
            throw err;
        }
	patients.count = count;
        return patients;
    }

    const list = async (id) => {
        const patient = await connection('patients')
            .join('addresses', 'patients.id', '=', 'addresses.patient_id')
            .join('fixed_reports', 'patients.id', '=', 'fixed_reports.patient_id')
            .select(
		'patients.id',
                'patients.name',
                'patients.cpf',
                'patients.phone_number',
                'patients.genre',
                'patients.birthday',
                'patients.screening_day',
                'patients.risk',
                'patients.status',
                'addresses.address',
                'addresses.street',
                'addresses.number',
                'addresses.complement',
                'fixed_reports.recent_travel',
                'fixed_reports.traveled_to_city',
                'fixed_reports.recent_contact'
            ).where('patients.id', id)
            .limit(1)
            .first();

        return patient
    }

    const findByCpf = async (cpf) => {
        const patient = await connection('patients')
            .select('id', 'name', 'cpf', 'password', 'created_at', 'status', 'birthday')
            .where('cpf', cpf)
            .limit(1)
            .first();
        return patient;
    }

    const verifyIfAlreadExists = async (cpf) => {
        const patient = await findByCpf(cpf);
        if (patient) return true;
        return false;
    }

    const deleteAll = async () => {
        try {
            await connection.transaction(async trx => {
                await connection('patients').truncate().transacting(trx);
                await connection('addresses').truncate().transacting(trx);
                await connection('fixed_reports').truncate().transacting(trx);
                await connection('daily_reports').truncate().transacting(trx);

            })
        } catch (err) {
            throw err
        }
    }

    const update = async (patient, address, id) => {
        let patientId
        try {
            await connection.transaction(async trx => {
                patientId = await connection('patients').where('id', id).update({
                    name: patient.name,
                    phone_number: patient.phone_number,
                    genre: patient.genre,
                    birthday: new Date(patient.birthday),
                    risk: patient.risk,
                    status: patient.status,
                }, ['id']).transacting(trx);
                await connection('addresses').update(address, ['id']).where('patient_id', id).transacting(trx);
            })
        } catch (err) {

            throw err
        }
        return patientId;
    }

    const updateStatusAndRisk = async (patient_id, status, risk) => {
        let patientId
        try {
              patientId = await connection('patients').where('id', patient_id).update({
                    risk: risk,
                    status: status,
                }, ['id']);
        } catch (err) {
            throw err
        }
        return patientId;
    }

    const deleteById = async (id) => {
        try {
            await connection.transaction(async trx => {
                await connection('patients').where('id', id).del().transacting(trx)
                await connection('addresses').where('patient_id', id).del().transacting(trx)
                await connection('fixed_reports').where('patient_id', id).del().transacting(trx)
                await connection('daily_reports').where('patient_id', id).del().transacting(trx)
            })
        } catch (error) {
            throw err
        }
        return true
    }


    return {
        store,
        listAll,
        verifyIfAlreadExists,
        deleteById,
        deleteAll,
        list,
        update,
        findByCpf,
        updateStatusAndRisk
    }
}

module.exports = Patient();
