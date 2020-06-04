const connection = require('../../database/connection');
const { getDay, getMonth, getYear, addDays } = require('date-fns');
const DailyReport = () => {
    const store = async (daily_report, patientId) => {
        let dailyReportId
        try {
            daily_report.patient_id = patientId
            dailyReportId = await connection('daily_reports').insert(daily_report)
        } catch (error) {
            throw error
        }
        return dailyReportId
    }

    // const formatDate = (date_report) => {
    //     const day = getDay(date_report);
    //     const month = getMonth(date_report);
    //     const year = getYear(date_report);
    //     const date = new Date(year, month, day);
    //     const nextDate = addDays(date, 1);
    //     return { date, nextDate }
    // }
    const listByDateAndPatient = async (patient_id, date_report, report_id) => {
        let daily_reports
        try {
            let query = connection('daily_reports')
                .where({readed: false})
								.join('patients', 'patients.id', '=', 'daily_reports.patient_id')
								.select(
											'patients.name',
											'patients.cpf',
											'patients.birthday',
											'patients.screening_day',
											'patients.risk',
											'patients.status',
											'patients.genre',
											'patients.phone_number',
											'daily_reports.id',
											'daily_reports.patient_id',	
											'daily_reports.fever',
											'daily_reports.cough',
											'daily_reports.difficulty_breathing',
											'daily_reports.sputum_production',
											'daily_reports.nasal_congestion',
											'difficulty_swallowing',
											'daily_reports.sore_throat',
											'daily_reports.coryza',
											'daily_reports.signs_of_cyanosis',
											'daily_reports.drawing',
											'daily_reports.intercostal',
											'daily_reports.fatigue',
											'daily_reports.myalgia_or_arthralgia',
											'daily_reports.headache',
											'daily_reports.chill',
											'daily_reports.red_spots_on_the_body',
											'daily_reports.enlarged_lymph_nodes',
											'daily_reports.diarrhea',
											'daily_reports.nausea',
											'daily_reports.vomiting',
											'daily_reports.dehydration',
											'daily_reports.inappetence',
											'daily_reports.loss_of_taste',
											'daily_reports.loss_of_smell',
											'daily_reports.others',
											'daily_reports.created_at',
									)
            if (patient_id) {
              query.andWhere('patient_id', patient_id)            
            }
						if (report_id) {
						  query.andWhere('daily_reports.id', report_id)
						}
            daily_reports = await query;
        } catch (error) {
            throw error
        }
        return daily_reports;
		}
		
		const updateStatusAndRisk = async (daily_report_id) => {
			let dailyReportId
			try {
					dailyReportId = await connection('daily_reports').update({
						readed: true
					}).where({id: daily_report_id})
			} catch (error) {
					throw error
			}
			return dailyReportId
	}

    return {
        store,
				listByDateAndPatient,
				updateStatusAndRisk
    }
}

module.exports = DailyReport()
