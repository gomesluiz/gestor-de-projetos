using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um Ativo.
  /// </summary>
  public class Ativo {
    public int Id { get; set; }
    public string Descricao { get; set; }
    public OrdemDeInvestimento OrdemDeInvestimento { get; set; }
    public CentroDeCusto CentroDeCusto { get; set; }
    public string Planta { get; set; }
    public int Quantidade { get; set; }
    public int Divisao { get; set; } 
    public int Natureza {get; set; }
    public int Propriedade { get; set; }
    public int DestinoDeUso { get; set; }
    public int SituacaoParaUso { get; set; }
    public string Observacoes { get; set; }
    public string Requisitante { get; set; }    
    public int SituacaoDoAtivo { get; set; }
  }
}