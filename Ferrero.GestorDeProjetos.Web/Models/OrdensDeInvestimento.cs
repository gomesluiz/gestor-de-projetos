using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma ordem de investimento.
  /// </summary>
  public class OrdemDeInvestimento {
    public int Id { get; set; }
    public string Numero { get; set; }
    public Projeto Projeto { get; set; }
    public double Valor { get; set; }
  }
}