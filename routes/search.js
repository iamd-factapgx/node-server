var net         = require('net');
var express     = require('express');
var router      = express.Router();

/**
 * Publication object
 */

router.post('/:type', function(req, res) {
    var query       = req.body.query;

    var socket = new net.Socket({
        readable: true,
        writable: true
    });



    socket.setTimeout(10000);
    socket.setKeepAlive(true);

    socket.on('connect', function () {
        socket.write('FIND ' + query + "\n");
    });

    response = '';
    socket.on('data', function (data) {
        response += data;
    })

    socket.on('end', function () {
        try {
            data = JSON.parse(response);
            var hits = [];
            if (data.hits != undefined && data.ok != undefined && data.ok == true) {
                hits = data.hits;
            }
            if (req.params.type == 'json') {
                res.json({ok: true, hits: hits});
            } else {
                res.setHeader("Content-Type", "text/xml;charset=UTF-8");
                res.render('search/results.xml.jade', {hits: hits});
            }
        } catch(e) {
            res.status(500);
            var error = "Error while retrieving data";
            if (req.params.type == 'json') {
                res.json({
                    ok: false,
                    error: error
                });
            } else {
                res.setHeader("Content-Type", "text/xml;charset=UTF-8");
                res.render('search/error.xml.jade', {error: error});
            }
        }

    });

    socket.on('error', function (err) {
        res.status(500);
        var error = "Error while retrieving data";
        if (req.params.type == 'json') {
            res.json({
                ok: false,
                error: error
            });
        } else {
            res.setHeader("Content-Type", "text/xml;charset=UTF-8");
            res.render('search/error.xml.jade', {error: error});
        }
        
        
    });    

    socket.connect(global.config.pubmed.port, global.config.pubmed.ip);
});

module.exports = router;
