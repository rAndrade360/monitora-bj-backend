const connection = require('../../database/connection');

const DailyReport = () => {
  const store = async (daily_report, patientId) => {
    let dailyReportId;
    try {
      daily_report.patient_id = patientId;
      dailyReportId = await connection('daily_reports').insert(daily_report);
    } catch (error) {
      throw error;
    }
    return dailyReportId;
  };

  const listByDateAndPatient = async (patient_id, date_report, report_id) => {
    let daily_reports;
    try {
      const query = connection('daily_reports')
        .where({ readed: true })
        .join('patients', 'patients.id', '=', 'daily_reports.patient_id')
        .join(
          'fixed_reports',
          'fixed_reports.patient_id',
          '=',
          'daily_reports.patient_id'
        )
        .select(
          'patients.name',
          'patients.cpf',
          'patients.birthday',
          'patients.genre',
          'patients.phone_number',
          'fixed_reports.screening_day',
          'fixed_reports.risk',
          'fixed_reports.status',
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
          'daily_reports.created_at'
        );
      if (patient_id) {
        query.where('daily_reports.patient_id', patient_id);
      }
      if (report_id) {
        query.where('daily_reports.id', report_id);
      }
      daily_reports = await query;
    } catch (error) {
      throw error;
    }
    return daily_reports;
  };

  const update = async (daily_report_id) => {
    let dailyReportId;
    try {
      dailyReportId = await connection('daily_reports')
        .update({
          readed: true,
          updated_at: connection.fn.now(),
        })
        .where({ id: daily_report_id });
    } catch (error) {
      throw error;
    }
    return dailyReportId;
  };

  return {
    store,
    listByDateAndPatient,
    update,
  };
};

module.exports = DailyReport();
