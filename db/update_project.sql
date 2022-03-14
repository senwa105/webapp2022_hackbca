UPDATE project
SET
    project_name = ?,
    project_owner_id = ?,  
    project_type_id = ?, 
    project_dt = STR_TO_DATE(?,'%m-%d-%Y'),
    project_description = ?,
    project_tech_stack
WHERE
	project_id = ? 
;