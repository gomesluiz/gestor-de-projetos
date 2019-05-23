using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma requisição.
  /// </summary>
  public class Requisicao {
    public int Id { get; set; }
    public long Numero { get; set; }
    public DateTime Data { get; set; }
    public long NumeroDaOrdemDeCompra { get; set; }
    public double Valor { get; set; }
    public string Descricao { get; set; }
    public string Localizacao { get; set; }
    public OrdemDeInvestimento OrdemDeInvestimento { get; set; }
    public Ativo Ativo { get; set; }
  }
}