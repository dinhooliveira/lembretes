angular.module('lembrete', [])
    .component('lembreteForm', {
        templateUrl: 'view/lembrete/lembrete-form.html',
        controller: function lembreteForm($scope) {
            var self = this;
            const lembreteModel = function () {
                this.dataInicio = '',
                    this.dataFim = '',
                    this.lembrete = '',
                    this.local = ''
                this.id = ''
            }

            self.lembrete = new lembreteModel();

            self.lembretes = [];

            self.createLembretes = function () {
                if (self.validate()) {

                    if (self.lembrete.dataFim == "") {
                        self.lembrete.dataFim = self.lembrete.dataInicio;
                    }
                    insert(formatDate(this.lembrete.dataInicio), formatDate(this.lembrete.dataFim), this.lembrete.lembrete, this.lembrete.local);
                    select();
                    this.lembrete = new lembreteModel();
                }
            };

            self.updateLembretes = function () {
                if (self.validateUpdate()) {

                    if (self.lembrete.dataFim == "") {
                        self.lembrete.dataFim = self.lembrete.dataInicio;
                    }
                    update(formatDate(this.lembrete.dataInicio), formatDate(this.lembrete.dataFim), this.lembrete.lembrete, this.lembrete.local,this.lembrete.id);
                    select();
                    this.lembrete = new lembreteModel();
                    self.cancelar();
                }
            };

            self.validate = function () {
                if (self.lembrete.dataInicio == "") {
                    alert("Data de Inicio é Obrigatorio");
                    return false;
                }

                if (self.lembrete.lembrete == "") {
                    alert("Lembrete é obrigatorio");
                    return false;
                }

                return true;
            };

            self.validateUpdate = function () {

                if (self.lembrete.id == "") {
                    alert("Não foi possivel identificar o lembrete");
                    return false;
                }

                if (self.lembrete.dataInicio == "") {
                    alert("Data de Inicio é Obrigatorio");
                    return false;
                }

                if (self.lembrete.lembrete == "") {
                    alert("Lembrete é obrigatorio");
                    return false;
                }

                return true;
            };

            const insert = function (data_inicio, data_fim, lembrete, local) {
                db.transaction(function (tx) {
                    tx.executeSql("INSERT INTO lembretes (data_inicio, data_fim,lembrete,local) VALUES (?,?,?,?)", [data_inicio, data_fim, lembrete, local]);
                });
            };

            function update(data_inicio, data_fim, lembrete, local,id) {
                db.transaction(function (tx) {
                    tx.executeSql("UPDATE  lembretes SET data_inicio=?, data_fim=?,lembrete=?,local=? where id=?", [data_inicio, data_fim, lembrete, local,id]);
                    alert("atualizado com sucesso!");
                }, function () {
                    alert("Ocorreu um erro ao atualizar");
                });
            };

            const select = function () {
                db.transaction(function (tx) {
                    tx.executeSql("SELECT * FROM lembretes order by  id desc", [], function (tx, results) {
                        if (results.rows.length > 0) {
                            let items = [];
                            for (var i = 0; i < results.rows.length; i++) {

                                items.push(results.rows.item(i));
                            }
                            self.lembretes = items;
                            //força a renderização do angulajs
                            $scope.$apply();
                        }
                    });
                });

            };

            function find(id) {
                db.transaction(function (tx) {
                        tx.executeSql("SELECT * FROM lembretes where id =? order by  id desc", [id], function (tx, results) {

                            if (results.rows.length > 0) {
                                self.lembrete.dataInicio = new Date(results.rows[0].data_inicio);
                                self.lembrete.dataInicio.setDate(self.lembrete.dataInicio.getDate() + 1);
                                self.lembrete.dataFim = new Date(results.rows[0].data_fim);
                                self.lembrete.dataFim.setDate(self.lembrete.dataFim.getDate() + 1);
                                self.lembrete.lembrete = results.rows[0].lembrete;
                                self.lembrete.local = results.rows[0].local;
                                self.lembrete.id = results.rows[0].id;
                                $scope.$apply();
                            }

                        });
                    }
                );

            }
            ;
            const excluirLembrete = function (id) {
                db.transaction(function (tx) {
                    tx.executeSql('delete from lembretes where id=?', [id], function (transaction, result) {
                        select();
                        alert("Excluido com sucesso!");
                        $scope.$apply();

                    }, function (transaction, error) {
                        alert("Não foi possivel excluir");
                    });
                });
            }

            this.excluir = function (id) {
                excluirLembrete(id);
            };

            this.findID = function (id) {
                find(id);
            }

            this.cancelar = function () {
                this.lembrete = new lembreteModel();
            }

            createTable();
            select();

        }
    })


