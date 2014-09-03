var express = require('express');
var router  = express.Router();
var net     = require('net');

/* GET /statistics */
router.get('/', function(req, res) {
    res.render('statistics', { title: 'Statistics' });
});

/* POST /statistics/list */
router.post('/list', function(req, res) {
    var socket = new net.Socket({
        readable: true,
        writable: true
    });

    socket.on('connect', function () {
        socket.write("DISEASES " + req.body.query + "\n");
    });

    socket.on('data', function (data) {
        res.setHeader('Content-Type', 'application/json;charset=UTF-8')
        res.end(data);
    })

    socket.on('error', function (err) {
        res.status(500);
        res.json({
            ok: false,
            error: 'Impossible to connect to Pubmed server',
        });
    });    

    socket.connect(global.config.pubmed.port, global.config.pubmed.ip);
    
});

/* POST /statistics/disease */
router.post('/disease', function(req, res) {
    var socket = new net.Socket({
        readable: true,
        writable: true
    });

    socket.on('connect', function () {
        socket.write("ANALYTICS " + req.body.query + " 1\n");
    });

    socket.on('data', function (data) {
        res.setHeader('Content-Type', 'application/json;charset=UTF-8')
        res.end(data);
    })

    socket.on('error', function (err) {
        res.status(500);
        res.json({
            ok: false,
            error: 'Impossible to connect to Pubmed server',
        });
    });    

    socket.connect(global.config.pubmed.port, global.config.pubmed.ip);
    
});


module.exports = router;
