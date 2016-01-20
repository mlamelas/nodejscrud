var mysql = require('mysql');
var historicDataSchema = new mysql.Schema({
	id: {type: 'increments', nullable: false, primary: true},
	group_id: {type: 'integer', nullable: false, unsigned: true},
	actual_instance_type: {type: 'string', maxlength: 10, nullable: false},
	actual_cost: {type: 'float'},
	actual_aws_zone: {type: 'string', maxlength: 10, nullable: false},
	start_date: {type: 'dateTime', nullable: false},
	end_date: {type: 'dateTime', nullable: true},
	savings: {type: 'float'}
	});
mysql.model('HistoricData',historicDataSchema);
