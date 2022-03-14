UPDATE project
SET
    project_name = ?,
    project_owner_id = (SELECT user_id
                        FROM user
                        WHERE CONCAT(first_name, ' ', last_name) = ?
                        LIMIT 1),  
    project_type_id = ?, 
    project_dt = STR_TO_DATE(?,'%m-%d-%Y'),
    project_description = ?,
    project_tech_stack = ?
WHERE
	project_id = ? 
;