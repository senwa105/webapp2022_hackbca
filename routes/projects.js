var express = require('express');
var router = express.Router();
var db = require('../db/db');

const fs = require('fs');
const path = require('path');
const { redirect } = require('express/lib/response');

function requireAdmin(req, res, next){
  if(res.locals.isAdmin)
    next();
  else
    res.redirect("/");
}

let projectsQuery = fs.readFileSync(path.join(__dirname, "../db/select_projects.sql"), "utf-8");

/* GET a list of all projects */
router.get('/', async function(req, res, next) {
  try {
    let results = await db.queryPromise(projectsQuery)
    // console.log(results);
    res.render('projects', { title: 'Projects', style: "tables", projects: results});
  } catch (err) {
    next(err);
  }
 

});

let project_types_query = fs.readFileSync(path.join(__dirname, "../db/select_project_types.sql"), "utf-8");


router.get('/create', requireAdmin ,async function(req, res, next) {
  try {

    let project_types = await db.queryPromise(project_types_query);
  
    res.render('projectform', {title: "Create Project", style: "newevent", 
                            project_types:project_types})
  } catch(err) {
    next(err);
  }
})

let singleProjectQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single.sql"), "utf-8");

router.get('/:project_id', function(req, res, next) {
  let project_id = req.params.project_id
  db.query(singleProjectQuery, [project_id], (err, results) => {
    if (err)
      next(err);
    console.log(results);
    let project_data = results[0];
    res.render('project', { title: 'Project Details', 
                      styles: ["tables", "project"], 
                      project_id : project_id, 
                      project_data: project_data});
  });
});


let singleProjectForFormQuery = fs.readFileSync(path.join(__dirname, "../db/select_project_single_form.sql"), "utf-8");

router.get('/:project_id/modify', requireAdmin , async function(req, res, next) {
  try {

    let project_types = await db.queryPromise(project_types_query);
    //Very much like the get('/:event_id') route... 
    let project_id = req.params.project_id
    let results = await db.queryPromise( singleProjectForFormQuery, [project_id]);
    let project_data = results[0];

    res.render('projectform', {title: "Modify Project", style: "newevent", 
                            project_types:project_types,
                            project: project_data}); // provide current project data
  } catch(err) {
    next(err);
  }

});


let insertProjectQuery = fs.readFileSync(path.join(__dirname, "../db/insert_project.sql"), "utf-8");
router.post('/', requireAdmin ,async function(req, res, next) {
  try {
    // let getOwnerId = fs.readFileSync(path.join(__dirname, "../db/get_user_id_from_name.sql"), "utf-8");
    // let owner_id = await db.query(getOwnerId, [req.body.project_owner]);
    // console.log('Owner Id');
    // console.log(owner_id)
    // console.log(owner_id.user_id);

    console.log(req.body.project_name)
    console.log(req.body.project_owner)
    console.log(req.body.project_type_id)
    console.log(req.body.project_date)
    console.log(req.body.project_description)
    console.log(req.body.project_tech_stack)

    let results = await db.queryPromise(insertProjectQuery, [req.body.project_name, 
      `${req.body.project_owner}`, 
      req.body.project_type_id,
      `${req.body.project_date}`,
      req.body.project_description,
      req.body.project_tech_stack
    ]);

  let project_id_inserted = results.insertId;
  res.redirect(`/projects/${project_id_inserted}`);
  } catch(err) {
    next(err);
  }
})

let updateProjectQuery = fs.readFileSync(path.join(__dirname, "../db/update_project.sql"), "utf-8"); 
router.post('/:project_id', requireAdmin ,async function(req, res, next) {
  try {
    let results = await db.queryPromise(updateProjectQuery, [req.body.project_name, 
      req.body.project_owner, 
      req.body.project_type_id,
      `${req.body.project_date}`,
      req.body.project_description,
      req.body.project_tech_stack,
      req.params.project_id // or req.body.project_id, since its a hidden input in the form
    ]);

  res.redirect(`/projects/${req.params.project_id}`);
  } catch(err) {
    next(err);
  }
})

let deleteProjectQuery = "DELETE FROM project WHERE project_id = ?";
router.get('/:project_id/delete', requireAdmin, async (req, res, next) => {
  try {
    await db.queryPromise(deleteProjectQuery, req.params.project_id);
    res.redirect('/projects')
  } catch (err) {
    next(err);
  }
})

module.exports = router;
