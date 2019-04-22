using System;

namespace Ferrero.GestorDeProjetos.Web {
  /// <summary>
  /// Projetos 
  /// </summary>
  public class Projeto {
    public int ID { get; set; }
    public string Nome { get; set; }
    public string Descricao { get; set; }
    public DateTime DateDeInicio { get; set; }
    public DateTime DateDeTermino { get; set; }
    public bool Concluido { get; set; }
  }
}