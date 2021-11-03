var Component = Component || {}

Component.Steps = (function() {

	function Steps() {
		this.titleStepByStepTop = $('.js-titulo-step-by-step');

		this.currentStep = 0;
		this.steps = $('.js-etapa');		
		this.btnPrevious = $('.js-btn-anterior');
		this.btnNext = $('.js-btn-proximo');			
		this.spanStepIndicator = $('.js-indicador-etapa');		

		this.comboItemStep1 = $('.js-step1');		
		this.comboItemStep2 = $('.js-step2');		
		this.comboSubitemStep2 = $('.js-subitem-step2');
		this.comboItemStep3 = $('.js-step3');		
		this.comboItemStep4 = $('.js-step4');						
		
		this.containerItemStep2 = $('.js-container-campos--etapa2');
		this.containerSubitemStep2 = $('.js-container-campos--subitem-etapa2');		
		this.containerItemStep3 = $('.js-container-campos--etapa3');		
		this.containerItemStep4 = $('.js-container-campos--etapa4');		
								
		this.labelSubitemStep2 = $('.js-label-subitem-step2');										
		this.labelItemStep4 = $('.js-label-item-step4');				
		
		this.spinner = $('.js-spinner--salvando');		
								
		this.emitter = $({});
		this.on = this.emitter.on.bind(this.emitter);				
	}

	Steps.prototype.init = function() {		
		this.btnPrevious.on('click', onBtnPreviousClicked.bind(this));
		this.btnNext.on('click', onBtnNextClicked.bind(this));		
		this.comboItemStep1.on('change', updateBtnNext.bind(this, this.comboItemStep1));
		this.comboItemStep2.on('change', onComboItemStep2Selected.bind(this));
		this.comboSubitemStep2.on('change', onComboSubitemStep2Selected.bind(this));
		this.comboItemStep3.on('change', onComboItemStep3Selected.bind(this));		

		this.comboItemStep4.on('change', onComboItemStep4Selected.bind(this, this.comboItemStep4));					
		disableBtnNext.call(this);		
		showStep.call(this, this.currentStep);			
	}	

	function onComboItemStep4Selected(combo) {
		if (this.currentStep + 1 >= this.steps.length) {		
			if (this.comboItemStep3.val() != 'id_ORGAOS') {
				if (this.comboItemStep4.val() != null && !combo.hasClass('js-siga-multiploselect--orgao') && combo.val() != null) {
					updateBtnNext.call(this, combo);
				} else {
					disableBtnNext.call(this);
				}
			} else {
				updateBtnNext.call(this, combo);
			}
		}
	}

	function onBtnPreviousClicked() {			
		switch (this.steps[this.currentStep - 1].id) {
			case 'step1':				
				updateBtnNext.call(this, this.comboItemStep1);				
				break;
			case 'step2':				
				updateBtnNext.call(this, this.comboItemStep2);
				break;
			case 'step3':				
				updateBtnNext.call(this, this.comboItemStep3);
				break;
			case 'step4':				
				updateBtnNext.call(this, this.comboItemStep4);				
				break;
		}

		updateStep.call(this, -1, false);	
	}

	function onBtnNextClicked() {			

		if (typeof this.steps[this.currentStep + 1] !== 'undefined') {

			switch (this.steps[this.currentStep + 1].id) {
			case 'step1':														
				updateBtnNext.call(this, this.comboItemStep1);
				break;
			case 'step2':
				this.containerItemStep2.show();				
				updateBtnNext.call(this, this.comboItemStep2);
				break;
			case 'step3':
				this.containerItemStep3.show();
				updateBtnNext.call(this, this.comboItemStep3);
				break;
			case 'step4':				
				this.containerItemStep4.show();										
					this.labelItemStep4.text('Por fim, selecione o item da etapa 4');
					this.containerItemStep4.removeClass('col-sm-6').addClass('col-sm-12');															
					updateBtnNext.call(this, this.comboItemStep4);				
				break;
			}

			updateStep.call(this, 1);
		} else if (this.currentStep + 1 >= this.steps.length) {
			save.call(this);
		}
	}

	function onComboItemStep3Selected() {				
		updateBtnNext.call(this, this.comboItemStep3);
	}
	
	function onComboItemStep2Selected() {		
		if (this.comboItemStep2.val() != '') {						
			if (this.comboSubitemStep2.find('option').length <= 1) {
				this.emitter.trigger('opcaoMovimentarSelecionada');
			}

			if (this.comboSubitemStep2.val() == null || this.comboSubitemStep2.val() === '') {
				this.labelSubitemStep2.css('opacity', '1');
			}			
			this.containerSubitemStep2.css({'visibility': 'visible', 'opacity': '1', 'max-width': '50%'});
			this.containerItemStep2.removeClass('col-sm-12').addClass('col-sm-6').css('max-width', '50%');
			updateBtnNext.call(this, this.comboSubitemStep2);			
		} else {
			this.containerSubitemStep2.css({'visibility': 'collapse', 'opacity': '0', 'max-width': '0px'});
			this.containerItemStep2.removeClass('col-sm-6').addClass('col-sm-12').css('max-width', '100%');
			this.labelSubitemStep2.css('opacity', '0');
			updateBtnNext.call(this, this.comboItemStep2);
		}				
	}

	function onComboSubitemStep2Selected() {
		this.labelSubitemStep2.css('opacity', '0');
		updateBtnNext.call(this, this.comboSubitemStep2);
	}

	function updateBtnNext(combo, evento) {						
		if (combo.val() > 0) {
			habilitarBtnProximo.call(this);			
		} else {
			disableBtnNext.call(this);
		}				
	}

	function disableBtnNext() {
		this.btnNext.attr('disabled', 'disabled');
	}

	function habilitarBtnProximo() {
		this.btnNext.removeAttr('disabled');
	}

	function showStep(number) {		
		this.steps[number].style.display = "block";

		if (number == 0) {
			this.btnPrevious.css('display', 'none');    
		} else {
			this.btnPrevious.css('display', 'inline');
		}
		if (number == (this.steps.length - 1)) {
			this.btnNext.removeClass('btn-primary').addClass('btn-success');
			this.btnNext.html('Salvar  <i class="fas fa-check"></i>');    			
		} else {
			this.btnNext.removeClass('btn-success').addClass('btn-primary');
			this.btnNext.html('Próximo  <i class="fas fa-long-arrow-alt-right"></i>');    
		}

		updateTitleStepByStepTop.call(this);
		updateSpanStepIndicator.call(this, number);		
	}

	function updateStep(number) {  		
		this.steps[this.currentStep].style.display = "none";

		this.currentStep += number;

		showStep.call(this, this.currentStep);
	}		

	function save() {																			
		
		startRequest.call(this);		

		setTimeout(function() { 
			endRequest.call(this); 
		}.bind(this), 3000);		
	}

	function startRequest() {
		$(this.steps[this.currentStep]).hide();
		this.spanStepIndicator.parent().hide();
		this.btnNext.parent().hide();					
		this.spinner.parent().parent().parent().show();
		this.spinner.css({'border': '15px solid rgba(0, 0, 0, .1)', 'border-left-color': '#28a745'});		
		this.spinner.parent().parent().parent().find('h1').html('Salvando configurações...');
		this.spinner.parent().find('.icone-salvo-sucesso').css('opacity', '0');		
	}

	function endRequest() {
		this.spinner.css('border-color', '#28a745');		
		this.spinner.parent().parent().parent().find('h1').html('Pronto! Suas configurações foram definidas!');
		this.spinner.parent().parent().parent().find('.icone-salvo-sucesso').css('opacity', '1');						
	}


	function updateTitleStepByStepTop() {		
		this.titleStepByStepTop.find('.js-titulo-etapa-topo').remove();
		this.titleStepByStepTop.find('.js-titulo-etapa-topo--duvida').remove();

		for (var i = 0; i <= this.currentStep; i++) {
			switch (this.steps[i].id) {				
			case 'step1':					
				this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Etapa 1</span>');				
				break;
			case 'step2':				
				this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Etapa 2</span>');				
				break;
			case 'step3':				
				this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Etapa 3</span>');							
				break;
			case 'step4':	
				switch (this.comboItemStep3.val()) {
				case 'id_ORGAOS':	
					this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Órgãos</span>');
					break;
				case 'id_UNIDADES':
					this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Unidades</span>');
					break;
				case 'id_CARGOS':
					this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Cargos</span>');
					break;
				case 'id_FUNCOES':
					this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Funções</span>');
					break;
				case 'id_PESSOAS':
					this.titleStepByStepTop.append('<span class="titulo-etapa-topo  js-titulo-etapa-topo">&nbsp;<i class="fa fa-angle-right" style="color: #000;font-size: 1rem;"></i>&nbsp;Pessoas</span>');
					break;
				}												
				break;
			}					
		}	

		switch (this.steps[this.currentStep].id) {				
		case 'step1':					
			this.titleStepByStepTop.append('<span class="titulo-etapa-topo--duvida  js-titulo-etapa-topo--duvida"><i class="fas fa-info-circle"></i></span>');		
			this.titleStepByStepTop.find('.js-titulo-etapa-topo--duvida').popover({
				title: 'Etapa 1',
				html: true,
				content: 'Aqui podem ser adicionados detalhes para explicar melhor o que deve ser feito nesta etapa'
			  });					
			break;
		case 'step2':				
			this.titleStepByStepTop.append('<span class="titulo-etapa-topo--duvida  js-titulo-etapa-topo--duvida"><i class="fas fa-info-circle"></i></span>');		
			this.titleStepByStepTop.find('.js-titulo-etapa-topo--duvida').popover({
				title: 'Etapa 2',
				html: true,
				content: 'Aqui podem ser adicionados detalhes para explicar melhor o que deve ser feito nesta etapa'
			  });				
			break;
		case 'step3':												
			break;
		case 'step4':																
			break;
		}
	}

	function updateSpanStepIndicator(number) {  
		this.spanStepIndicator.removeClass('active');	   
	  	this.spanStepIndicator[number].className += " active";
	}

	return Steps;	
}());

$(function() {	
	$('[data-toggle="popover"]').popover();

	var steps = new Component.Steps();
	steps.init();
}); 