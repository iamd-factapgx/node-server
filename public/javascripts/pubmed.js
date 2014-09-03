(function ($) {
    $(function () {
        /**
         * Handle search format change
         */
        $('#search-format a').click(function (e) {
            e.preventDefault();
            $('#search-format a').removeClass('selected');
            
            $this = $(this);
            $this.addClass('selected');
            $('#search-form').attr('action', '/search/' + $this.attr('data-format'));
        });

        $('#search-query').keyup(function () {
            var $this = $(this);
            $results = $('#search-results');
            if ($this.val().length >= 2) {
                $.ajax({
                    url:        '/search/json',
                    dataType:   'json',
                    data:       { query: $this.val() },
                    type:       'POST'
                }) .done(function( data ) {
                    $results.html("");

                    if (data.ok) {
                        $results.append('<h1>Publications (' + data.hits.length + ' found)</h1>')
                        for (i in data.hits) {
                            var hit = data.hits[i];
                            $results.append('<div class="well well-sm"><h2>' + hit.title + ' (' + hit.year + ')</h2><p>' + hit.abstrct + '</p></div>')
                        }
                    }
                });
            } else {
                $results.html("");
            }
        });
    
        var disease = {};
        var reloadDrugs = function () {
            $('.statistics .drugs .entity button').click(function ( ) {
                if ($(this).is(".disabled")) {
                    return;
                }

                $('.statistics .genes').html("");
                var id = $(this).attr('data-id');
                if (disease.relations[id]) {
                    for (var i in disease.relations[id].relations) {
                        var relation = disease.relations[id].relations[i];
                        $('.statistics .genes').append('<div class="entity"><button class="btn btn-warning">' + relation.name.toUpperCase() + ' (' + relation.score + ')</button></div>');
                    }
                }

            });
        };
        

        var reloadDiseases = function() {
            $('.statistics .diseases .entity button').click(function ( ) {
                disease = {};
                $('.statistics .drugs').html("");
                $('.statistics .genes').html("");

                $.ajax({
                    url:        '/statistics/disease',
                    dataType:   'json',
                    data:       { query: $(this).attr('data-id') },
                    type:       'POST'
                }).done(function( data ) {
                    disease = data; 
                    $('.statistics .drugs').html("");
                    $('.statistics .genes').html("");

                    if (!isEmpty(data.relations)) {
                        for (var i in data.relations) {
                            var relation = data.relations[i];
                            $('.statistics .drugs').append('<div class="entity"><button data-id="' + relation.id + '" class="btn btn-success">' + relation.name + '</button></div>');
                        }
                    } else {
                        $('.statistics .drugs').append('<div class="entity"><button class="btn btn-danger disabled">No indirect relations found</button></div>');
                    }
                    reloadDrugs();
                }).error(function (err) {
                    console.log(err);
                });
            });
        };

        $('#search-disease').keyup(function ( ) {
            var val = $(this).val();
            $('.statistics .diseases').html("");
            $('.statistics .drugs').html("");
            $('.statistics .genes').html("");
            if (val.length >= 2) {
                $.ajax({
                    url:        '/statistics/list',
                    dataType:   'json',
                    data:       { query: val },
                    type:       'POST'
                }).done(function( data ) {
                    $('.statistics .diseases').html("");
                    $('.statistics .drugs').html("");
                    $('.statistics .genes').html("");

                    for (var i in data) {
                        var disease = data[i];
                        $('.statistics .diseases').append('<div class="entity"><button data-id="' + disease.id + '" class="btn btn-info">' + disease.name + '</button></div>');
                    }
                reloadDiseases();
                }).error(function (err) {
                    console.log(err);
                });
            }
        });
    });
})(jQuery);

var isEmpty = function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
};