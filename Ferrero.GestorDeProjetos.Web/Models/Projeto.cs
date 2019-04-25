using System;
using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models {
  /// <summary>
  /// Projetos 
  /// </summary>
  public class Projeto {
    public int ID { get; set; }

    [Required]
    public string Nome { get; set; }
    
    [Required]
    public string Descricao { get; set; }
    
    [DataType(DataType.Date)]
    [Display(Name = "Data de Início")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    public DateTime DataDeInicio { get; set; }
    
    [DataType(DataType.Date)]
    [Display(Name = "Data de Término")]
    [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
    public DateTime DataDeTermino { get; set; }
    
    [Display(Name = "Concluído?")]
    public bool Concluido { get; set; }
  }
}