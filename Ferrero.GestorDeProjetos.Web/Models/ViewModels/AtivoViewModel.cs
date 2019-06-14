using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um Ativo.
  /// </summary>
  public class AtivoViewModel {

    [Required(ErrorMessage = "Por favor, digite o número do ativo.")]
    [Display(Name = "Número")]
    public int Id { get; set; } 
    
    [Required(ErrorMessage = "Por favor, digite uma breve descrição do ativo.")]
    [StringLength(50, ErrorMessage = "O descrição do ativo deve possuir no máximo 50 caracteres.")]
    [Display(Name = "Descrição")]
    public string Descricao { get; set; }
    
    [Required(ErrorMessage = "Por favor, escolha o numero centro de custo.")]
    [Display(Name = "Centro de Custo")]
    public int CentroDeCustoId { get; set; }

    [Required(ErrorMessage = "Por favor, escola o numero da ordem de investimento.")]
    [Display(Name = "Ordem de Investimento")]
    public int OrdemDeInvestimentoId { get; set; }
    
    [Required(ErrorMessage = "Por favor, digite a planta do ativo.")]
    [StringLength(50, ErrorMessage = "O nome da localização deve possuir no máximo 50 caracteres.")]
    public string Planta { get; set; }

    [Required(ErrorMessage = "Por favor, digite a quantidade de ativos.")]
    public int Quantidade { get; set; }

    [Required(ErrorMessage = "Por favor, escolha a divisão do ativo.")]
    [Display(Name = "Divisão")]
    public int Divisao { get; set; } //1 - Industrial; 2 - Comercial

    [Required(ErrorMessage = "Por favor, escolha a natureza do ativo.")]
    public int Natureza {get; set; } //1 - Serviço; 2 - Itens, materiais e/ou máquinas

    [Required(ErrorMessage = "Por favor, escolha a propriedade do ativo.")]
    public int Propriedade { get; set; } //1 - Bem Próprio; 2 - Benfeitorias em Propriedades de Terceiros
    
    [Required(ErrorMessage = "Por favor, escolha o destino de uso do ativo.")]
    [Display(Name = "Destino de Uso")]
    public int DestinoDeUso { get; set; }  
    //0 - Não Informado 1 - Administrativo 2 - Processo Fabril

    [Required(ErrorMessage = "Por favor, escolha a situação para uso do ativo.")]
    [Display(Name = "Situação para Uso")]
    public int SituacaoParaUso { get; set; } 
    // 0 - Nao Informado 1 - Pronto para Uso 2 - Máquina em Processo de Montagem 
    // 3 - Edificacao em Andamento

    [StringLength(250, ErrorMessage = "As observações devem possuir no máximo 250 caracteres.")]
    [Display(Name = "Observações")]
    public string Observacoes { get; set; }

    [Required(ErrorMessage = "Por favor, digite o nome do requisitante do ativo.")]
    [StringLength(50, ErrorMessage = "O nome do requisitante deve possuir no máximo 50 caracteres.")]
    public string Requisitante { get; set; }    
 
    [Display(Name = "Situação")]
    public int SituacaoDoAtivo { get; set; }

    [Display(Name = "Situação")]
    public string DescricaoDaSituacaoDoAtivo
    {
        get{
            string _descricao;
            switch(SituacaoDoAtivo)
            {
                case 1: _descricao = "NÃO TRANSFERIDO"; 
                        break;
                case 2: _descricao = "TRANSFERIDO"; 
                        break;
                default:
                    _descricao = "NÃO INFORMADA"; 
                        break;
            }
            return _descricao;
        }
    }
  }
}