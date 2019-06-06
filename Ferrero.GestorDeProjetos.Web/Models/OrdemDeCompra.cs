using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma ordem de compra.
  /// </summary>
  public class OrdemDeCompra {
    public int Id { get; set; }
    public long Numero { get; set; }
    
    [DataType(DataType.Date)]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    public DateTime Data { get; set; }
    public long NumeroDaRequisicao { get; set; }
    public double Valor { get; set; }
    public string Descricao { get; set; }
    public Ativo Ativo { get; set; }
  }
}