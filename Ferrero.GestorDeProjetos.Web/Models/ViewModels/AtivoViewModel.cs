using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels 
{
  /// <summary>
  /// Esta classe contém os atributos e métodos de um Ativo.
  /// </summary>
  public class AtivoViewModel {

    public int Id { get; set; } 

    [StringLength(10, ErrorMessage = "O número do ativo deve possuir no máximo 10 dígitos.")]
    [Display(Name = "Número")]
    public string Numero { get; set; } 
    
    [Required(ErrorMessage = "Por favor, digite uma breve descrição do ativo.")]
    [StringLength(50, ErrorMessage = "O descrição do ativo deve possuir no máximo 50 caracteres.")]
    [Display(Name = "Descrição")]
    public string Descricao { get; set; }
    
    [Required(ErrorMessage = "Por favor, escolha o numero centro de custo.")]
    [Display(Name = "Centro de Custo")]
    public int CentroDeCustoId { get; set; }

    [Display(Name = "Centro de Custo")]
    public string CentroDeCustoNome { get; set; }

    [Required(ErrorMessage = "Por favor, escola o numero da ordem de investimento.")]
    [Display(Name = "Ordem de Investimento")]
    public int OrdemDeInvestimentoId { get; set; }
    
    [Display(Name = "OrdemDeInvestimento")]
    public string OrdemDeInvestimentoNumero { get; set; }

    [Required(ErrorMessage = "Por favor, digite a planta do ativo.")]
    [StringLength(50, ErrorMessage = "O nome da localização deve possuir no máximo 50 caracteres.")]
    public string Planta { get; set; }

    [Required(ErrorMessage = "Por favor, digite a quantidade de ativos.")]
    public int Quantidade { get; set; }

    [Required(ErrorMessage = "Por favor, escolha a divisão do ativo.")]
    [Display(Name = "Divisão")]
    public int Divisao { get; set; } 
    // 0 - Não Informado; 1 - Industrial; 2 - Comercial
    [Display(Name = "Divisão")]
    public string DescricaoDaDivisao
    {
        get{
            string _descricao;
            switch(Divisao)
            {
                case 1: _descricao = "Industrial"; 
                        break;
                case 2: _descricao = "Comercial"; 
                        break;
                default:
                    _descricao = "NÃO INFORMADA"; 
                        break;
            }
            return _descricao;
        }
    }

    [Required(ErrorMessage = "Por favor, escolha a natureza do ativo.")]
    public int Natureza {get; set; } 
    // 0 - Não Informado; 1 - Serviço; 2 - Itens, materiais e/ou máquinas; 
    // 3 - Serviços, itens, materiais e/ou máquinas. 

    [Required(ErrorMessage = "Por favor, escolha a propriedade do ativo.")]
    public int Propriedade { get; set; } 
    // 0 - Não informado; 1 - Bem Próprio; 2 - Benfeitorias em Propriedades de Terceiros
    
    [Display(Name = "Imobilizado Utilizado no administrativo")]
    public bool UsoNoAdministrativo { get; set; }
    // true - Uso no administrativo

    [Display(Name = "Imobilizado Utilizado no processo fabril")]
    public bool UsoNoProcessoFabril { get; set; }
    // true - Uso no processo fabril

    [Display(Name = "Imobilizado pronto para uso")]
    public bool ProntoParaUso { get; set; }
    // true - Pronto para uso

    [Display(Name = "Máquina em processo de montagem/instalação")]
    public bool MaquinaEmMontagemInstalacao { get; set; }
    // true - Máquina em montagem e instalação 

    [Display(Name = "Edificações em anadamento (contruções, ampliações civis")]
    public bool EdificacaoEmAndamento {get; set;}
    // true Edificação em andamento

    [StringLength(250, ErrorMessage = "As observações devem possuir no máximo 250 caracteres.")]
    [Display(Name = "Observações")]
    public string Observacoes { get; set; }

    [Required(ErrorMessage = "Por favor, digite o nome do requisitante do ativo.")]
    [StringLength(50, ErrorMessage = "O nome do requisitante deve possuir no máximo 50 caracteres.")]
    public string Requisitante { get; set; }    
 
    [Display(Name = "Situação")]
    public int SituacaoDoAtivo { get; set; }
    // 0 - Não Informado, 1 - Solicitado, 2 - Não Transferido, 3 - Transferido.

    [Display(Name = "Situação")]
    public string DescricaoDaSituacaoDoAtivo
    {
        get{
            string _descricao;
            switch(SituacaoDoAtivo)
            {
                case 1: _descricao = "SOLICITADO"; 
                        break;
                case 2: _descricao = "NÃO TRANSFERIDO"; 
                        break;
                case 3: _descricao = "TRANSFERIDO";
                        break;
                default:
                    _descricao = "NÃO INFORMADA"; 
                        break;
            }
            return _descricao;
        }
    }

    public AtivoViewModel()
    {
        Planta      = "INDUSTRIAL";
        Quantidade  = 1;
        Divisao     = 1;                // INDUSTRIAL
        Propriedade = 1;                // BEM PRÓPRIO
        SituacaoDoAtivo = 1;            // SOLICITADO
        UsoNoAdministrativo = false;
        UsoNoProcessoFabril = false;
        ProntoParaUso = false;
        MaquinaEmMontagemInstalacao = false;
        EdificacaoEmAndamento = false;
    }
  }
}