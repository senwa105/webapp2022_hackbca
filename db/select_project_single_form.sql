SELECT 
	project_id, 
    project_name,
    project_owner_id,
    project_type_id,
    DATE_FORMAT(project_dt, '%m-%d-%Y') as project_date_mdy,
    project_description,
    project_tech_stack
FROM
	project
WHERE
	project_id = ?
LIMIT 1