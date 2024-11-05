//estado inicial da calculadora
const initialState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0
};

class Calculadora {
    constructor() {
        this.state = { ...initialState };//o operador sprad nesse caso faz com que tenhamos o objeto inicial inctocável, ou seja, não será alterado, sempre fazendo uma cópia e mantendo o original intácto
        this.init(); //este método quando chamado no construtor faz com que a calculadora fique pronta para uso imediatamente após sua criação
    }

    // Método para inicializar e associar botões aos eventos
    init() {
        //nesse método é configurado o display com a configuração inicial passada no objeto principal (initialState)
        document.getElementById('display').value = this.state.displayValue;

        // nesse trecho os botões da calculadora são associados a eventos de clique
        //que chamam métodos específicos para limpar a memória (clearMemory) nos botões AC e C
        //ou definir operações (setOperation) são elas: + - x / =.

        document.getElementById('ac').addEventListener('click', () => this.clearMemory());
        document.getElementById('c').addEventListener('click', () => this.clearMemory());
        document.getElementById('operDiv').addEventListener('click', () => this.setOperation('/'));
        document.getElementById('operMulti').addEventListener('click', () => this.setOperation('*'));
        document.getElementById('operMenos').addEventListener('click', () => this.setOperation('-'));
        document.getElementById('operSomar').addEventListener('click', () => this.setOperation('+'));
        document.getElementById('igual').addEventListener('click', () => this.setOperation('='));

        // do mesmo modo que cada botão correspondente ao número é associado a 
        //um evento de clique que chama o método (addDigit) com o número correspondente
        document.getElementById('sete').addEventListener('click', () => this.addDigit('7'));
        document.getElementById('oito').addEventListener('click', () => this.addDigit('8'));
        document.getElementById('nove').addEventListener('click', () => this.addDigit('9'));
        document.getElementById('quatro').addEventListener('click', () => this.addDigit('4'));
        document.getElementById('cinco').addEventListener('click', () => this.addDigit('5'));
        document.getElementById('seis').addEventListener('click', () => this.addDigit('6'));
        document.getElementById('um').addEventListener('click', () => this.addDigit('1'));
        document.getElementById('dois').addEventListener('click', () => this.addDigit('2'));
        document.getElementById('tres').addEventListener('click', () => this.addDigit('3'));
        document.getElementById('zero').addEventListener('click', () => this.addDigit('0'));
        document.getElementById('virgula').addEventListener('click', () => this.addDigit('.'));
    }

    //O método clearMemory reinicia o estado da calculadora para 
    //os valores definidos em initialState, limpando todos os dados e ou calculos
    clearMemory() {
        this.setState({ ...initialState });
    }

    //Este método a seguirm define a operação matemática. Se current for 0, 
    //atualiza o estado com a nova operação e muda current para 1. 
    //Se já houver uma operação, ele executa a lógica de cálculo.
    setOperation(operation) {
        if (this.state.current === 0) {
            this.setState({ operation, current: 1, clearDisplay: true });
        } else {
            const equals = operation === '=';
            const currentOperation = this.state.operation;
    
            const values = [...this.state.values];
            try {
                // esse metódo arredanda valores que são incosistentes no JS (0,3+0,6 = 0,89999999) então ele arruma esses bugs
                values[0] = Math.ceil(eval(`${values[0]} ${currentOperation} ${values[1]}`) * 1e10) / 1e10;
    
                if (isNaN(values[0]) || !isFinite(values[0])) {
                    this.clearMemory();
                    return;
                }
            } catch (e) {
                values[0] = this.state.values[0];
            }
            
            values[1] = 0;
    
            this.setState({
                displayValue: values[0].toString().slice(0, 10), 
                operation: equals ? null : operation,
                current: equals ? 0 : 1,
                clearDisplay: !equals,
                values
            });
        }
    }
    

    //O método a seguir permite que o usuário adicione dígitos ao display,
    // verificando se o ponto decimal pode ser adicionado e atualiza 
    //o valor exibido e os valores da operação.
    addDigit(n) {
        if (n === '.') {
            // caso o display tenha um ponto, não permite adicionar outro
            if (this.state.displayValue.includes('.')) {
                return;
            }
            // se for inserido o "." em um display vazio ou com "0", inicia com "0.". 
            //No nosso caso sempre terá um "0"
            if (this.state.displayValue === '0' || this.state.clearDisplay) {
                this.setState({ displayValue: '0.', clearDisplay: false });
                return;
            }
        }
    
        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay;
        const currentValue = clearDisplay ? '' : this.state.displayValue;
    
        // aqui faz uma verificação para limitar o display a no máximo 11 caracteres
        if (currentValue.length >= 11) {
            return;
        }
    
        const displayValue = currentValue + n;
        this.setState({ displayValue, clearDisplay: false });
    
        if (n !== '.') {
            const i = this.state.current;
            const newValue = parseFloat(displayValue);
            const values = [...this.state.values];
            values[i] = newValue;
            this.setState({ values });
        }
    }
    

    //O método setState atualiza o estado da calculadora
    //e redefine o valor do display para refletir o novo estado. Exemplo:
    // 1 + 1 = 2 -- Cada clique ele apresentará o valor, e ao clicar no =
    //apresentara o resultado do cálculo. Sendo possível aproveitar o último valor
    //no caso o resultado do último cálculo
    setState(newState) {
        this.state = { ...this.state, ...newState };
        document.getElementById('display').value = this.state.displayValue;
    }
}

// iniciando a calculadora (instanciando ela para "ativar suas funções")
const calculadora = new Calculadora();
