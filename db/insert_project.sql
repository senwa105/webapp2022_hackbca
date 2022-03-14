INSERT INTO project
        (`project_name`, `project_owner_id`, `project_type_id`, `project_dt`, `project_description`, `project_tech_stack`) 
VALUES 
        (?, 
        (SELECT user_id
                FROM user
                WHERE CONCAT(first_name, ' ', last_name) = ?
                LIMIT 1), 
        ?, 
        STR_TO_DATE(?, '%m-%d-%Y'), 
        ?,
        ?); 