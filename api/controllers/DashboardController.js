/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    var data = {};
    const user = await User.findOne(req.me.id);
    const questions = await Question.find().populate('departments', {
      where: {
        id: user.department
      }
    });
    for (let index in questions) {
      const q = await Question.findOne({id: questions[index].id}).populate('comments');
      questions[index].comment = q.comments.length;
      const a = await Question.findOne({id: questions[index].id}).populate('answers');
      questions[index].answer = a.answers.length;
      const x = await User.findOne(questions[index].userId);
      questions[index].createdBy = x.fullName;
    }
    data.questions = questions;
    data.isAdmin = req.me.isAdmin;
    // console.log(data);
    return res.view('pages/homepage',
      {
        layout: 'layouts/empty',
        locals: data
      });
  },
};

