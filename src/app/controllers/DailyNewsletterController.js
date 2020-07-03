const DailyNewsletter = require('../models/DailyNewsletter');

const DailyNewsletterModel = new DailyNewsletter();

const filterData = (newsletters) => {
  const data = {
    logs: [],
    count: {},
    valuesNewCount: {},
    valuesOldCount: {},
    valuePerPatient: {},
  };
  newsletters.map((newsletter) => {
    data.logs.push({
      fieldname: newsletter.field_name,
      oldValue: newsletter.old_value,
      newValue: newsletter.new_value,
      patient_id: newsletter.patient_id,
      address: newsletter.address,
      zone: newsletter.zone,
    });
    data.count[newsletter.field_name] = data.count[newsletter.field_name]
      ? data.count[newsletter.field_name] + 1
      : 1;
    data.valuesNewCount[newsletter.new_value] = data.count[newsletter.new_value]
      ? data.count[newsletter.new_value] + 1
      : 1;
    data.valuesOldCount[newsletter.old_value] = data.count[newsletter.old_value]
      ? data.count[newsletter.old_value] + 1
      : 1;
    data.valuePerPatient[newsletter.patient_id] = {
      [newsletter.field_name]: {
        oldValue: newsletter.old_value,
        newValue: newsletter.new_value,
      },
    };
  });
  return data;
};

class DailyNewsletterController {
  async show(req, res) {
    if (
      req.userPermission !== 'secretary' &&
      req.userPermission !== 'basic_unity'
    )
      return res.status(401).json({ error: 'Não autorizado' });
    const {
      date,
      old_value,
      new_value,
      patient_id,
      is_distinct,
      with_address,
    } = req.query;
    const {strategy_id} = req.headers;
    let newsletter;
    try {
      newsletter = await DailyNewsletterModel.show({
        date,
        oldValue: old_value,
        newValue: new_value,
        patient_id,
        is_distinct,
        with_address,
        strategy_id: parseInt(strategy_id),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Can not load data' });
    }
    const filteredData = filterData(newsletter);
    return res.json(filteredData);
  }
}

module.exports = new DailyNewsletterController();
