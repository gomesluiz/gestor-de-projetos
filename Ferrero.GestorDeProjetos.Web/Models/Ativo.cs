using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Esta classe contém os atributos e métodos de um Ativo.
  /// </summary>
  public class Ativo {

    [Required(ErrorMessage = "Por favor, digite o número do ativo.")]
    public long Id { get; set; }

    [StringLength(50, ErrorMessage = "O descrição do ativo deve possuir no máximo 50 caracteres.")]
    [Required(ErrorMessage = "Por favor, digite a descrição do ativo.")]
    public string Descricao { get; set; }
    
    [StringLength(50, ErrorMessage = "O nome da localização deve possuir no máximo 50 caracteres.")]
    [Required(ErrorMessage = "Por favor, entre com localizacao do ativo.")]
    public string Localizacao { get; set; }
    
    [Required(ErrorMessage = "Por favor, entre com  numero da ordem de investimento.")]
    
    [Display(Name = "Ordem de Investimento")]
    public string OrdemDeInvestimento { get; set; }
    
    public int Situacao { get; set; }

    public CentroDeCusto CentroDeCusto { get; set; }
  }
}