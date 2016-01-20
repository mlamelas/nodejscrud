var Seq = require('sequelize');

var sequelize = new Seq('demo', 'demo', 'demo', {
  host: '172.17.0.2',
  dialect: 'mysql'
});

var HistoricData = sequelize.define('historicData', {
    id: {type: Seq.INTEGER, autoIncrement: true, primaryKey: true},
    group_id: {type: Seq.INTEGER},
    actual_instance_type: {type: Seq.STRING},
    actual_cost: {type: Seq.FLOAT},
    actual_aws_zone: {type: Seq.STRING},
    start_date: {type: Seq.DATE},
    end_date: {type: Seq.DATE},
    savings: {type: Seq.FLOAT}
  }
);
