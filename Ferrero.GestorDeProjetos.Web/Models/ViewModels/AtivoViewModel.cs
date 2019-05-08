using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.ViewModels {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um Ativo.
  /// </summary>
  public class AtivoViewModel {

    [Required(ErrorMessage = "Por favor, digite o número do ativo.")]
    [Display(Name = "Número")]
    public long Id { get; set; }

    [StringLength(50, ErrorMessage = "O descrição do ativo deve possuir no máximo 50 caracteres.")]
    [Required(ErrorMessage = "Por favor, digite a descrição do ativo.")]
    public string Descricao { get; set; }
    
    [StringLength(50, ErrorMessage = "O nome da localização deve possuir no máximo 50 caracteres.")]
    [Required(ErrorMessage = "Por favor, entre com localizacao do ativo.")]
    public string Localizacao { get; set; }

    [StringLength(7, ErrorMessage = "A ordem de investimento deve possuir no máximo 7 caracteres.")]
    [Required(ErrorMessage = "Por favor, entre com  numero da ordem de investimento.")]
    [Display(Name = "Ordem de Investimento")]
    public string OrdemDeInvestimento { get; set; }
    
    public int Situacao { get; set; }

    [Display(Name = "Centro de Custo")]
    public int CentroDeCustoId { get; set; }
  }
}