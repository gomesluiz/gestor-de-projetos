using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de uma requisição.
  /// </summary>
  public class RequisicaoViewModel {
    public int Id { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da requisição.")]
    [Display(Name = "Número")]
    public long Numero { get; set; }

    [DataType(DataType.Date)]
    [Display(Name = "Data da Requisição")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
    [Required(ErrorMessage = "Por favor, entre com a data da requisição.")]
    public DateTime Data { get; set; }

    [Required(ErrorMessage = "Por favor, digite o número da ordem de compra.")]
    [Display(Name = "Número da Ordem de Compra")]
    public long NumeroDaOrdemDeCompra { get; set; }

    [Required(ErrorMessage = "Por favor, digite o valor da requisição.")]
    [Display(Name = "Número da Ordem de Compra")]
    public double Valor { get; set; }

    [StringLength(250, ErrorMessage = "O nome do projeto deve possuir no máximo 250 caracteres.")]
    [Required(ErrorMessage = "Por favor, digite a descrição da requisição.")]
    public string Descricao { get; set; }
    
    [StringLength(50, ErrorMessage = "O nome do projeto deve possuir no máximo 50 caracteres.")]
    [Required(ErrorMessage = "Por favor, digite a localização.")]
    public string Localizacao { get; set; }

    [Required(ErrorMessage = "Por favor, digite a ordem de investimento.")]
    public int OrdemDeInvestimentoId { get; set; }

    [Required(ErrorMessage = "Por favor, digite o ativo.")]
    public Ativo AtivoId { get; set; }
  }
}