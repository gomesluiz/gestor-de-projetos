using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um Ativo.
  /// </summary>
  public class Ativo {
    public long Id { get; set; }
    public string Descricao { get; set; }
    public string Localizacao { get; set; }
    public string OrdemDeInvestimento { get; set; }
    public int Situacao { get; set; }
    public CentroDeCusto CentroDeCusto { get; set; }
  }
}