$(document).ready(function () {

	var s_qtvendmes3;
	var s_qtvendmes2;
	var s_qtvendmes1;
	var s_media;
	var s_venda_mesatual;
	var s_estoque;
	var s_diasEstoque;

	var g_filtro = { };
	var g_medida = "UNIDADES";
	var g_resultTemp;
	var g_res;

	$('.unidade-medida').on('click', function (e) {
		e.preventDefault();
		if(this.text != g_medida) {
			g_medida = this.text;
			alterarMedida();
		}
	});

	$('.btn-filter').click(function (e) {
		e.preventDefault();
		g_filtro = { };
		aplicarFiltro(g_filtro);
	});

	$(document).on('click', '.familia', function(e) {
		e.preventDefault();
		g_filtro = { familia : this.text };
		aplicarFiltro(g_filtro);
	});

	$(document).on('click', '.cliente', function(e) {
		e.preventDefault();
		g_filtro = { 'nome-cliente' : this.text };
		aplicarFiltro(g_filtro);
	});

	$(document).on('click', '.sku', function(e) {
		e.preventDefault();
		showLoading();
		g_filtro = { sku : this.text };
		aplicarFiltro(g_filtro);
	});

	aplicarFiltro = function(filtro) {
		carregarFamilias(filtro);
		carregarSkus(filtro);
		carregarDemandaEstoque(filtro);
		carregarClientes(filtro);
	}

	Number.prototype.format = function (n, x, s, c) {
		var re  = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
		    num = this.toFixed(Math.max(0, ~~n));

		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};

	carregarFamilias = function (filtro) {

		request = $.ajax({

			method:   "POST",
			url:      "http://localhost:8080/kam/painelgerencial/familias/consultar",
			dataType: "json",
			data:     {
				login:  "testeLogin",
				filtro : filtro
			}

		})
		;

		request.done(function (res) {

			res = eval(res);

			if (res.erro == null) {

				var familias = '<table class="table table-striped"><tbody>';

				$.each(res.result.familia, function () {
					familias += '<tr><td><a href="#" class="familia">' + this + '</a></td></tr>'
				})

				familias += '</tbody></table>';
				$("#familias").html(familias);

			}

			else {
				alert(res.erro);
			}

		});

		request.fail(function (jqXHR, textStatus) {

		});

	};

	carregarSkus = function (filtro) {

		request = $.ajax({

			method:   "POST",
			url:      "http://localhost:8080/kam/painelgerencial/skus/consultar",
			dataType: "json",
			data:     {
				login:  "testeLogin",
				filtro : filtro
			}

		})
		;

		request.done(function (res) {

			res = eval(res);

			if (res.erro == null) {

				var skus = '<table class="table table-striped"><tbody>';

				$.each(res.result.sku, function () {
					skus += '<tr><td><a href="#" class="sku">' + this + '</a></td></tr>'
				})

				skus += '</tbody></table>';
				$("#skus").html(skus);

			}

			else {
				alert(res.erro);
			}

		});

		request.fail(function (jqXHR, textStatus) {

		});

	};

	carregarDemandaEstoqueHead = function (demandasEstoquesBody, sum) {

		var demandasEstoquesHead =

			    '<thead>' +
			    '<tr>' +
			    '<th class="text-center">SUBTOTAL</th>' +
			    '<th class="text-center">' + Math.round(sum.s_qtvendmes3).format(0, 3, '.') + '</th>' +
			    '<th class="text-center">' + Math.round(sum.s_qtvendmes2).format(0, 3, '.') + '</th>' +
			    '<th class="text-center">' + Math.round(sum.s_qtvendmes1).format(0, 3, '.') + '</th>' +
			    '<th class="text-center">' + Math.round(sum.s_media).format(0, 3, '.') + '</th>' +
			    '<th class="text-center">' + Math.round(sum.s_venda_mesatual).format(0, 3, '.') + '</th>' +
			    '<th class="text-center">' + Math.round(sum.s_estoque).format(0, 3, '.') + '</th>' +
			    '<th class="text-center">' + Math.round(sum.s_estoque / sum.s_media * 30).format(0, 3, '.') + ' (m&eacute;dia)</th>' +
			    '</tr>' +
			    '<tr>' +
			    '<th>FAM&Iacute;LIA</th>' +
			    '<th class="text-center">FEV</th>' +
			    '<th class="text-center">MAR</th>' +
			    '<th class="text-center">ABR</th>' +
			    '<th class="text-center">M&Eacute;DIA</th>' +
			    '<th class="text-center">MAI</th>' +
			    '<th class="text-center">ESTOQUE TOTAL</th>' +
			    '<th class="text-center">DIAS DE ESTOQUE</th>' +
			    '</tr>' +
			    '</thead>';

		demandasEstoquesHead += demandasEstoquesBody;
		$("#demandaEstoque").html(demandasEstoquesHead);

	};

	carregarDemandaEstoqueBody = function () {

		s_qtvendmes3 = 0;
		s_qtvendmes2 = 0;
		s_qtvendmes1 = 0;
		s_media = 0;
		s_venda_mesatual = 0;
		s_estoque = 0;
		s_diasEstoque = 0;

		var map = new Map();

		g_res.result.demandasEstoques.reduce(function (demandaAux, demanda) {

			if (map.has(demanda.familia)) {

				demandaAux = map.get(demanda.familia);
				demandaAux['vendas-mes-3'] += demanda['vendas-mes-3'];
				demandaAux['vendas-mes-2'] += demanda['vendas-mes-2'];
				demandaAux['vendas-mes-1'] += demanda['vendas-mes-1'];
				demandaAux['estoque-total'] += demanda['estoque-total'];
				demandaAux['preco-venda'] += demanda['preco-venda'];
				demanda = demandaAux;
			}

			map.set(demanda.familia, demanda);

		}, {});

		g_resultTemp = map;
		transformarMapa();

	};

	transformarMapa = function () {

		var demandasEstoques = '<tbody>';
		var precoVenda = 1;

		g_resultTemp.forEach(function (value, key) {

			if (g_medida != "UNIDADES") {
				precoVenda = value['preco-venda'];
			}

			var media = ((value['vendas-mes-3'] + value['vendas-mes-2'] + value['vendas-mes-1']) / 3) * precoVenda;
			media = media * precoVenda;
			var diasEstoque = media != 0 ? ((value['estoque-total'] / media) * precoVenda) * 30 : 0;

			s_qtvendmes3 += value['vendas-mes-3'] * precoVenda;
			s_qtvendmes2 += value['vendas-mes-2'] * precoVenda;
			s_qtvendmes1 += value['vendas-mes-1'] * precoVenda;

			s_media += media;
			s_estoque += value['estoque-total'];
			s_diasEstoque += diasEstoque;

			value['vendas-mes-3'] = Math.round(value['vendas-mes-3']).format(0, 3, '.');
			value['vendas-mes-2'] = Math.round(value['vendas-mes-2']).format(0, 3, '.');
			value['vendas-mes-1'] = Math.round(value['vendas-mes-1']).format(0, 3, '.');

			value.venda_mesatual = 0
			value['estoque-total'] = Math.round(value['estoque-total']).format(0, 3, '.')

			var sum = {};

			demandasEstoques += '' +
				'<tr>' +
				'<td>' + value.familia + '</td>' +
				'<td class="text-center">' + value['vendas-mes-3'] + '</td>' +
				'<td class="text-center">' + value['vendas-mes-2'] + '</td>' +
				'<td class="text-center">' + value['vendas-mes-1'] + '</td>' +
				'<td class="text-center">' + Math.round(media).format(0, 3, '.') + '</td>' +
				'<td class="text-center">' + value.venda_mesatual + '</td>' +
				'<td class="text-center">' + value['estoque-total'] + '</td>' +
				'<td class="text-center">' + Math.round(diasEstoque).format(0, 3, '.') + '</td>' +
				'</tr>';

		});

		sum = {
			s_qtvendmes3:     s_qtvendmes3,
			s_qtvendmes2:     s_qtvendmes2,
			s_qtvendmes1:     s_qtvendmes1,
			s_media:          s_media,
			s_venda_mesatual: s_venda_mesatual,
			s_estoque:        s_estoque,
			s_diasEstoque:    s_diasEstoque
		};

		demandasEstoques += '</tbody:';
		carregarDemandaEstoqueHead(demandasEstoques, sum);

	}

	carregarDemandaEstoque = function (filtro) {

		$.post(

			"http://localhost:8080/kam/painelgerencial/demandaestoque/consultar",

			{
				login:  "testeLogin",
				filtro : filtro
			})

			.done(function (res) {

				res = eval(res);

				if (res.erro == null) {
					g_res = res;
					carregarDemandaEstoqueBody();
					atualizarSimulador();
				}

				hideLoading();

			})

			.fail(function (res) {
				hideLoading();
				alert(res.erro);
			})

		;

		/*request = $.ajax({

			method:   "POST",
			url:      "http://localhost:8080/kam/painelgerencial/demandaestoque/consultar",
			dataType: "json",
			data:     {
				login:  "testeLogin",
				filtro : filtro
			}

		});

		request.done(function (res) {

			res = eval(res);

			if (res.erro == null) {
				carregarDemandaEstoqueBody(res);
				atualizarSimulador();
			}

			else {
				alert(res.erro);
			}

		});*/

		request.fail(function (jqXHR, textStatus) {

		});

		hideLoading();

	};

	atualizarSimulador = function () {

		$("#realizado").text((s_qtvendmes3 + s_qtvendmes2 + s_qtvendmes1 + s_venda_mesatual).format(0, 3, '.'));
		$("#mesAtual").text(s_venda_mesatual.format(0, 3, '.'));
		$("#mediaProjetada").text(s_media.format(0, 3, '.'));

	};

	carregarClientes = function(filtro) {

		request = $.ajax({

			method:   "POST",
			url:      "http://localhost:8080/kam/painelgerencial/clientes/consultar",
			dataType: "json",
			data:     {
				login:  "testeLogin",
				filtro : filtro
			}

		});

		request.done(function (res) {

			res = eval(res);

			if (res.erro == null) {

				var clientes = '<table class="table table-striped"><tbody>';

				$.each(res.result['nome-cliente'], function () {
					clientes += '<tr><td><a href="#" class="cliente">' + this + '</a></td></tr>'
				})

				clientes += '</tbody></table>';
				$("#clientes").html(clientes);

			}

			else {
				alert(res.erro);
			}

		});

		request.fail(function (jqXHR, textStatus) {

		});

	};

	$("#regional").html($("regional").html());

	showLoading = function() {
		//$('#loading').removeClass("hidden");
		$('#loading').hide();
	};

	hideLoading = function() {
		//$('#loading').addClass("hidden");
		$('#loading').show();
	};

	alterarMedida = function() {
		transformarMapa();
	};

	carregarFamilias();
	carregarSkus();
	carregarDemandaEstoque();
	carregarClientes();

});
