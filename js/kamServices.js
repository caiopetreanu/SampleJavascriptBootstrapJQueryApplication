jQuery(function ($) {

	$("#titulo, #painel-gerencial").click(function (e) {
		e.preventDefault();
		$("#loginFrame", window.parent.document).addClass('hidden');
		$("#dashboardFrame", window.parent.document).removeClass('hidden');
		$("#emManutencaoFrame", window.parent.document).addClass('hidden');
	});

	$("#excessos, #rupturas, #upload-arquivos, #alterar-senha").click(function (e) {
		e.preventDefault();
		$("#loginFrame", window.parent.document).addClass('hidden');
		$("#dashboardFrame", window.parent.document).addClass('hidden');
		$("#emManutencaoFrame", window.parent.document).attr("src", "emManutencao.html");
		$("#emManutencaoFrame", window.parent.document).removeClass('hidden');
	});

	$("#sair").click(function (e) {
		e.preventDefault();
		$("#loginFrame", window.parent.document).removeClass('hidden');
		$("#dashboardFrame", window.parent.document).removeClass('hidden');
		$("#emManutencaoFrame", window.parent.document).removeClass('hidden');
	});

	$("#dias-menos").click(function (e) {

		e.preventDefault();
		var diasAntes;
		var diasDepois;

		$.each($(".dias"), function () {
			diasAntes = parseInt(this.textContent, 10);
			diasDepois = diasAntes - 30;
			this.textContent = ( diasDepois < 0 ? 0 : diasDepois ) + " DIAS";
		})

		var width = parseInt($("#progress-dias").css("width"), 10);
		var valuemin = $("#progress-dias").attr("aria-valuemin");
		var valuemax = $("#progress-dias").attr("aria-valuemax");
		var range = valuemax - valuemin;

		$("#progress-dias").css("width", ( diasDepois / range ) * range);



	});

	$("#dias-mais").click(function (e) {

		e.preventDefault();
		var diasAntes;
		var diasDepois;

		var valuemin = $("#progress-dias").attr("aria-valuemin");
		var valuemax = $("#progress-dias").attr("aria-valuemax");
		var range = valuemax - valuemin;

		$.each($(".dias"), function () {
			diasAntes = parseInt(this.textContent, 10);
			diasDepois = diasAntes + 30;
			this.textContent = ( diasDepois > range ? range : diasDepois ) + " DIAS";
		})

		var width = parseInt($("#progress-dias").css("width"), 10);

		$("#progress-dias").css("width", diasAntes != valuemax ? ( diasDepois / range ) * range : width);

	});

	$("#entrar").click(function (event) {

		event.preventDefault();
		event.stopImmediatePropagation();

		var login = $("#inputLogin").val();
		var senha = $("#inputPassword").val();

		var request = $.ajax({

			method:      "POST",
			url:         "http://localhost:8080/kam/login",
			dataType:    "json",
			traditional: true,
			data:        {
				login: login,
				senha: senha
			}

		});

		request.done(function (res) {

			res = eval(res);

			if (res.erro == null) {
				$("#loginFrame", window.parent.document).addClass('hidden');
				$("#dashboardFrame", window.parent.document).attr("src", "dashboard.html");
				$("#dashboardFrame", window.parent.document).removeClass('hidden');
				disableScroll();
			}

			else {
				alert(res.erro);
			}

		});

		request.fail(function (jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});

	});

	$(".alert").addClass("in").fadeOut(4500);

	/* swap open/close side menu icons */
	$('[data-toggle=collapse]').click(function () {
		// toggle icon
		$(this).find("i").toggleClass("glyphicon-chevron-right glyphicon-chevron-down");
	});

	disableScroll = function () {
		$('html, body', window.parent.document).css({
			'overflow': 'hidden',
			'height':   '100%'
		});
	}

	enableScroll = function () {
		$('html, body', window.parent.document).css({
			'overflow': 'auto',
			'height':   'auto'
		});
	}

	$("#dashboardFrame")

});