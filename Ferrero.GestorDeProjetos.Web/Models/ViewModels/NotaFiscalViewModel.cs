using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma nota fiscal.
  /// </summary>
  public class NotaFiscalViewModel {
    public int Id { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da nota fiscal.")]
    [Display(Name = "Número")]
    public int Numero { get; set; }

    [DataType(DataType.Date)]
    [Display(Name = "Data de Lancamento")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    [Required(ErrorMessage = "Por favor, informe a data de lançamento da nota fiscal.")]
    public DateTime DataDeLancamento { get; set; }

    [Required(ErrorMessage = "Por favor, digite o fornecedor da nota fiscal.")]
    [Display(Name = "Fornecedor")]
    public int FornecedorId { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da ordem de compra.")]
    [Display(Name = "Ordem de Compra")]
    public int OrdemDeCompraId { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da migo.")]
    [Display(Name = "Número da Migo")]
    public long Migo { get; set; }

    [Required(ErrorMessage = "Por favor, digite o valor nota fiscal.")]
    [Display(Name = "Valor")]
    public double Valor { get; set; }
  }
}