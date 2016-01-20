var sequelize= require('sequelize');

var HistoricData = sequelize.define('historicData', {
    id: {type: Seq.INTEGER, autoIncrement: true, primaryKey: true},
	group_id: {type: Seq.INTEGER},
    actual_instance_type: {type: Seq.STRING},
    actual_cost: {type: Seq.Float},
    actual_aws_zone: {type: Seq.STRING},
    start_date: {type: Seq.Date},
    end_date: {type: Seq.Date},
    savings: {type: Seq.Float}
  }
