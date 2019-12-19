const express = require('express');
const router = express.Router();
const { Questions, sequelize } = require('../models');
const latToCyr = require('../utils/latinToCyrilic');

/**
 * @api {get} /search/
 * @apiGroup Search
 * @apiName SearchQuestionsOnPublic
 * @apiPermission all
 * @apiParam {String} search  Search text
 * @apiParam {Number} category_id  Category ID by search
 * @apiSuccess {Boolean} ok Response status
 * @apiSuccess {Object[]} data  Questions List
 * @apiSuccess {Number} total_count  Total count
 */
const search = async (req, res, next) => {
  const { search, category_id } = req.query;
  try {
    const questionsIds = {};
    const searchKeys = search.split(' ');
    for (const key of searchKeys) {
      let whereStatement = {
        is_private: false,
        title: {
          'iLike': `%${latToCyr(key)}%`
        }
      };
      if (category_id) whereStatement.category_id = category_id

      const searchByTitle = await Questions.findAll({
        attributes: ['id'],
        where: whereStatement
      });

      for (const searchResultByTitle of searchByTitle) {
        if (questionsIds[searchResultByTitle.id] !== undefined) {
          questionsIds[searchResultByTitle.id] += 1;
        } else {
          questionsIds[searchResultByTitle.id] = 1;
        }
      }
    }

    for (const k of searchKeys) {
      let whereStatement = {
        is_private: false,
        question: {
          'iLike': `%${latToCyr(k)}%`
        },
        answer: {
          'iLike': `%${latToCyr(k)}%`
        }
      };
      if (category_id) whereStatement.category_id = category_id

      const searchByContent = await Questions.findAll({
        attributes: ['id'],
        where: whereStatement
      });

      for (const searchResultByContent of searchByContent) {
        if (questionsIds[searchResultByContent.id] !== undefined) {
          questionsIds[searchResultByContent.id] += 1;
        } else {
          questionsIds[searchResultByContent.id] = 1;
        }
      }
    }

    const sortQuestionsIds = Object.keys(questionsIds).sort( function( a, b ){ return questionsIds[b] - questionsIds[a] } )

    let values = [];
    let data = [];
    for (var i = 1; i <= sortQuestionsIds.length; i++) {
      values.push(`(${sortQuestionsIds[i - 1]}, ${i})`);
    }

    if (values.length > 0) {

      let sql = 
      ` SELECT q.*, cat.name AS category, ans_user.username AS answered_username 
        FROM questions AS q 
        LEFT OUTER JOIN categories AS cat ON q.category_id = cat.id
        LEFT OUTER JOIN users AS ans_user ON q.answered_user_id = ans_user.id 
        JOIN( values ${values.join(', ')} ) AS x (idx, ordering) ON q.id = x.idx ORDER BY x.ordering;
      `;
  
      data = await sequelize.query(
        sql,
        {
          type: sequelize.QueryTypes.SELECT, 
          raw: false 
        }
      );
    }

    res.status(200).json({
      ok: true,
      data,
      total_count: sortQuestionsIds.length
    });
  } catch (error) {
    next(error);
  }
}

router.get('/', search);

module.exports = router;