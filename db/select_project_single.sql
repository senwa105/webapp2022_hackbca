SELECT
	project_id,
    project_name,
    CONCAT(user.first_name, ' ', user.last_name) as project_owner,
    DATE_FORMAT(project_dt, '%Y-%m-%d') as project_date_ymd,
    DATE_FORMAT(project_dt, '%b %d (%a)') as project_date,
	project_type.project_type,
    project_description,
    project_tech_stack
FROM
	project, user, project_type
WHERE
    project_id = ?
	and project_owner_id = user.user_id
    and project.project_type_id = project_type.project_type_id
LIMIT 1