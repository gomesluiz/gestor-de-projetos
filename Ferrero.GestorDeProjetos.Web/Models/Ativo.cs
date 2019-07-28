namespace Ferrero.GestorDeProjetos.Web.Models
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um Ativo.
    /// </summary>
    public class Ativo {
    public int Id { get; set; }
    public string Numero {get; set;}
    public string Descricao { get; set; }
    public OrdemDeInvestimento OrdemDeInvestimento { get; set; }
    public CentroDeCusto CentroDeCusto { get; set; }
    public string Planta { get; set; }
    public int Quantidade { get; set; }
    public int Divisao { get; set; } 
    public int Natureza {get; set; }
    public int Propriedade { get; set; }
    public bool UsoNoAdministrativo { get; set; }
    public bool UsoNoProcessoFabril { get; set; }
    public bool ProntoParaUso { get; set; }
    public bool MaquinaEmMontagemInstalacao { get; set; }
    public bool EdificacaoEmAndamento {get; set;}
    public string Observacoes { get; set; }
    public string Requisitante { get; set; }    
    public int SituacaoDoAtivo { get; set; }
  }
}