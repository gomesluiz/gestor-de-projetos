using Microsoft.EntityFrameworkCore;

using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.Domain;
using Ferrero.GestorDeProjetos.Web.Models.Gantt;
using Ferrero.GestorDeProjetos.Web.Models.Kanban;
using Ferrero.GestorDeProjetos.Web.Models.Security;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Context
{
    public class ApplicationDbContext : IdentityDbContext<Usuario>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

        public DbSet<Ativo> Ativos { get; set; }
        public DbSet<CentroDeCusto> CentrosDeCusto { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<Projeto> Projetos { get; set; }
        public DbSet<OrdemDeInvestimento> OrdensDeInvestimento { get; set; }
        public DbSet<ResumoFinanceiro> ResumosFinanceiros { get; set; }
        public DbSet<RequisicaoDeCompra> RequisicoesDeCompra { get; set; }
        public DbSet<NotaFiscal> NotasFiscais { get; set; }
        public DbSet<Atividade> Atividades { get; set; }
        public DbSet<Vinculo> Vinculos { get; set; }
        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<Documento> Documentos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Model Ativo
            builder.Entity<Ativo>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Numero)
                    .HasMaxLength(12);
                entity.Property(e => e.Descricao)
                    .HasMaxLength(50);
                entity.Property(e => e.Planta)
                    .HasMaxLength(50);
                entity.Property(e => e.Quantidade)
                    .IsRequired()
                    .HasDefaultValue(1);
                entity.Property(e => e.Divisao)
                    .IsRequired()
                    .HasDefaultValue(1);
                entity.Property(e => e.Natureza)
                    .IsRequired();
                entity.Property(e => e.Propriedade)
                    .IsRequired()
                    .HasDefaultValue(1);
                entity.Property(e => e.UsoNoAdministrativo)
                    .IsRequired()
                    .HasDefaultValue(false);
                entity.Property(e => e.UsoNoProcessoFabril)
                    .IsRequired()
                    .HasDefaultValue(false);
                entity.Property(e => e.ProntoParaUso)
                    .IsRequired()
                    .HasDefaultValue(false);
                entity.Property(e => e.MaquinaEmMontagemInstalacao)
                    .IsRequired()
                    .HasDefaultValue(false);
                entity.Property(e => e.EdificacaoEmAndamento)
                    .IsRequired()
                    .HasDefaultValue(false);
                entity.Property(e => e.Observacoes)
                    .HasMaxLength(250);
                entity.Property(e => e.Requisitante)
                    .HasMaxLength(50);
                entity.Property(e => e.SituacaoDoAtivo)
                    .IsRequired()
                    .HasDefaultValue(1);
            });

            // Model CentroDeCusto
            builder.Entity<CentroDeCusto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .IsRequired();
                entity.Property(e => e.Nome)
                    .HasMaxLength(50)
                    .IsRequired();
            });

            // Model Fornecedor
            builder.Entity<Fornecedor>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .IsRequired();
                entity.Property(e => e.Nome)
                    .HasMaxLength(50)
                    .IsRequired();
            });

            // Model Projeto
            builder.Entity<Projeto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .IsRequired();
                entity.Property(e => e.Nome)
                    .HasMaxLength(50)
                    .IsRequired();
                entity.Property(e => e.Descricao)
                    .HasMaxLength(250);
                entity.Property(e => e.DataDeInicio)
                    .HasColumnType("DATETIME");
                entity.Property(e => e.DataDeTermino)
                    .HasColumnType("DATETIME");
                entity.Property(e => e.Concluido)
                    .IsRequired();
            });

            // Model OrdemDeInvestimento
            builder.Entity<OrdemDeInvestimento>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Numero)
                    .HasMaxLength(7)
                    .IsRequired();
                entity.Property(e => e.Budget)
                    .HasColumnType("DECIMAL(10,2)")
                    .IsRequired();
            });

            // Model LancamentoFinanceiro
            builder.Entity<ResumoFinanceiro>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Data)
                    .HasColumnType("DATETIME")
                    .IsRequired();
                entity.Property(e => e.Commitment)
                    .HasColumnType("DECIMAL(10,2)")
                    .IsRequired();
                entity.Property(e => e.Assigned)
                    .HasColumnType("DECIMAL(10,2)")
                    .IsRequired();
                    entity.Property(e => e.Actual)
                    .HasColumnType("DECIMAL(10,2)")
                    .IsRequired();
                    entity.Property(e => e.Available)
                    .HasColumnType("DECIMAL(10,2)")
                    .IsRequired();
            });

            // Model RequisicaoDeCompra
            builder.Entity<RequisicaoDeCompra>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .IsRequired();
                entity.Property(e => e.Numero)
                    .IsRequired();
                entity.Property(e => e.Data)
                    .HasColumnType("DATETIME");
                entity.Property(e => e.Descricao)
                    .HasMaxLength(250);
                entity.Property(e => e.Proposta)
                    .HasMaxLength(500);
            });

            // Model NotaFiscal
            builder.Entity<NotaFiscal>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .IsRequired();
                entity.Property(e => e.Numero)
                    .IsRequired();
                entity.Property(e => e.DataDeLancamento)
                    .HasColumnType("DATETIME");
                entity.Property(e => e.Migo)
                    .IsRequired();
                entity.Property(e => e.Valor)
                    .IsRequired();
            });

            // Model Atividade
            builder.Entity<Atividade>(entity =>
            {
                entity.HasOne(p => p.Projeto);
            });

            // Model Vinculo
            builder.Entity<Vinculo>(entity =>
            {
                entity.HasOne(p => p.Projeto);
            });

            // Model Tarefa
            builder.Entity<Tarefa>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Titulo)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.Descricao)
                    .HasMaxLength(250);
                entity.Property(e => e.ListaId)
                    .IsRequired();
                entity.HasOne(p => p.Projeto);
            });

            // Model Documento
            builder.Entity<Documento>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Titulo)
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.Descricao)
                    .HasMaxLength(250);
                entity.Property(e => e.Versao)
                    .IsRequired()
                    .HasMaxLength(10);
                entity.Property(e => e.Arquivo)
                    .IsRequired()
                    .HasMaxLength(500);
                entity.HasOne(p => p.Projeto);
            });

            // Security Models
            builder.Entity<Usuario>(entity =>
            {
                entity.ToTable(name: "Users");  
                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasMaxLength(50);       
            });

            builder.Entity<IdentityRole>(entity =>
            {
                entity.ToTable(name: "Roles");
            });

            builder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.ToTable("UserRoles");
            });

            builder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable("UserLogins");
            });

            builder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable("RoleClaims");

            });

            builder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable("UserTokens");
            });
        }  
    }
}