const express = require('express');
const router = express.Router({ mergeParams: true });

// GET /meta/heartbeat - Retrieve the server heartbeat
router.get('/heartbeat', function(req, res, next) {
  res.status(200).json({ status: true });
});

// GET /meta/members - Retrieve the team member list
router.get('/members', function(req, res, next) {
  const members = [
    'Au-yong Xiang Rong Alwinson',
    'Irvin Lim Wei Quan',
    'Tan Ngee Joel Jonas',
    'Teng Yong Hao',
  ];

  res.status(200).json({ status: true, result: members });
});

module.exports = router;
