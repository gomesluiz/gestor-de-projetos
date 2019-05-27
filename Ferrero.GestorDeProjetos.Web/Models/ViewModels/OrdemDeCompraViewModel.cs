using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma ordem de compra.
  /// </summary>
  public class OrdemDeCompraViewModel {
    public int Id { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da ordem de compra.")]
    [Display(Name = "Número")]
    public long Numero { get; set; }

    [DataType(DataType.Date)]
    [Display(Name = "Data")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    [Required(ErrorMessage = "Por favor, informe a data da ordem de compra.")]
    public DateTime Data { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da requisicao.")]
    [Display(Name = "Número da Requisição")]
    public long NumeroDaRequisicao { get; set; }

    [Required(ErrorMessage = "Por favor, digite o valor da ordem de compra.")]
    [Display(Name = "Valor")]
    public double Valor { get; set; }

    [StringLength(250, ErrorMessage = "A descrição da ordem de compra deve possuir no máximo 250 caracteres.")]
    [Required(ErrorMessage = "Por favor, digite a descrição da ordem de compra.")]
    public string Descricao { get; set; }
    
    [Required(ErrorMessage = "Por favor, digite o ativo.")]
    [Display(Name = "Ativo")]
    public int AtivoId { get; set; }
  }
}