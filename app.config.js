const db = openDatabase("lembretes", '1.0', "Meus Lembretes", 2 * 1024 * 1024);
const createTable = function () {
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS lembretes (id integer primary key, data_inicio date, data_fim date,lembrete text,local text,ciente text)");
    });
};

function formatDate(date) {
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    return date.getFullYear() + "-" + mes.toString().padStart(2, '0') + "-" + dia.toString().padStart(2, '0');
}

function formatDateBR(date) {
    let mes = date.getMonth() + 1;
    let dia = date.getDate()+1;
    return dia.toString().padStart(2, '0')+ "/" + mes.toString().padStart(2, '0') + "/" +   date.getFullYear() ;
}

angular.module('App').config(['$routeProvider',
    function config($routeProvider) {
        $routeProvider.when('/usuarios', {})
            .when('/home', {
                template: '<home></home>'
            })
            .when('/lembrete', {
                template: '<lembrete-form></lembrete-form>'
            })
            .otherwise('/home');
    }
]);
