var net         = require('net');
var express     = require('express');
var router      = express.Router();
var Publication = require('../models/Publication').Publication;

/**
 * Publication object
 */

router.post('/', function(req, res) {
    var publication = new Publication();

    publication._id         = req.body._id;
    publication.title       = req.body.title;
    publication.abstrct     = req.body.abstrct;
    publication.year        = req.body.year;

    if (publication.valid()) {
        var socket = new net.Socket({
            readable: true,
            writable: true
        });

        socket.on('connect', function () {
            socket.write('STORE ' + JSON.stringify(publication) + "\n");
        });

        response = '';
        socket.on('data', function (data) {
           response += data;
        })

        socket.on('end', function () {
            res.end(response);
        });

        socket.on('error', function (err) {
            res.status(500);
            res.json({
                ok: false,
                error: 'Impossible to connect to Pubmed server',
            });
        });    

        socket.connect(global.config.pubmed.port, global.config.pubmed.ip);
    } else {
        res.status(500);
        res.json({ok: false, error: "Invalid publication"})
    }
});

module.exports = router;
