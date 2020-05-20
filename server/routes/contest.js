const express = require("express");
const contestRouter = express.Router();

const ContestModel = require("../model/contest");

/*Route: GET contests/
  Desc: get all active contests
*/

contestRouter.get("/", (req, res) => {
  ContestModel.find({ deadline_date: { $gte: Date.now() } })
    .then((contests) => res.json({ contests }))
    .catch((err) => {
      next(err);
    });
});

/*Route: GET contest/:id
  Desc: get contest with the id
*/
contestRouter.get("/:id", (req, res) => {
  ContestModel.findById(req.params.id)
    .then((contest) => {
      if (contest) {
        res.json({ contest });
      } else {
        res.json({ message: "No Contest Found" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

/*Route: POST contest/
  Desc: Create new contest
*/
contestRouter.post("/", (req, res) => {
  const newContest = new ContestModel({
    title: req.body.title,
    description: req.body.description,
    prize_amount: req.body.prize_amount,
    deadline_date: req.body.deadline_date,
    user_id: req.body.user_id,
  });

  newContest
    .save()
    .then((result) => {
      res.json({
        message: 'Contest created successfully',
      });
    })
    .catch((err) => next(err));
});

/*Route: PUT contest/:id
  Desc: Update contest
*/

contestRouter.put("/:id", (req, res) => {
    ContestModel.findByIdAndUpdate(req.params.id,{
        title = req.params.title,
        description = req.params.description,
        deadline_date = req.params.deadline_date,
        prize_amount = req.params.prize_amount,
    },(err,result)=>{
        if(err){
            next(err)
        }
        res.json({
            message:'Contest updated successfully'
        })
    })
  
});

module.exports = contestRouter;
