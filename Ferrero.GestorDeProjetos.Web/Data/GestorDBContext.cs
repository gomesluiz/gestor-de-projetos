using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

using Ferrero.GestorDeProjetos.Web.Models;

namespace Ferrero.GestorDeProjetos.Web.Data
{
  public class GestorDBContext : DbContext
  {
    public GestorDBContext(DbContextOptions<GestorDBContext> options)
    : base(options) { }

    public DbSet<Projeto> Projetos { get; set; }

    protected override void OnModelCreating(ModelBuilder mb)
    {
      mb.Entity<Projeto>(entity =>
      {
        entity.HasKey(e => e.ID);
        entity.Property(e => e.Nome)
          .HasMaxLength(50)
          .IsRequired();
        entity.Property(e => e.DataDeInicio)
          .HasColumnType("DATETIME");
        entity.Property(e => e.DataDeTermino)
          .HasColumnType("DATETIME");
        entity.Property(e => e.Concluido)
          .IsRequired();
      });

      mb.Entity<CentroDeCusto>(entity =>
      {
        entity.HasKey(e => e.ID);
        entity.Property(e => e.Nome)
          .HasMaxLength(50)
          .IsRequired();
      });
      /* 
      mb.Entity<Ativo>(entity =>
      {
        entity.HasKey(e => e.ID);
        entity.Property(e => e.CentroDeCusto.ID)
          .IsRequired();
        entity.Property(e => e.Localizacao)
          .HasMaxLength(50)
          .IsRequired();
        entity.Property(e => e.OrdemDeInvestimento)
          .HasMaxLength(7)
          .IsRequired();
        entity.Property(e => e.Situacao)
          .IsRequired();
      });
      */
    }
  }
}