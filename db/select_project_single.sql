SELECT
	project_id,
    project_name,
    project_owner_id,
    project_type_id,
    DATE_FORMAT(project_dt, '%Y-%m-%d') as project_date_ymd,
    DATE_FORMAT(project_dt, '%b %d (%a)') as project_date,
    project_description,
    project_tech_stack
FROM
	project
LIMIT 1