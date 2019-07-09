using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma Nota Fiscal.
  /// </summary>
  public class NotaFiscal {
    public int Id { get; set; }
    public int Numero { get; set; }
    public DateTime DataDeLancamento { get; set; }
    public Fornecedor Fornecedor { get; set; }
    public RequisicaoDeCompra RequisicaoDeCompra { get; set; }
    public long Migo { get; set; }
    public double Valor { get; set; }
  }
}