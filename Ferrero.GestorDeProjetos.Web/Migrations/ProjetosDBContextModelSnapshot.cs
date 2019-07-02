﻿// <auto-generated />
using System;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Ferrero.GestorDeProjetos.Web.Migrations
{
    [DbContext(typeof(ProjetosDBContext))]
    partial class ProjetosDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.Ativo", b =>
                {
                    b.Property<int>("Id");

                    b.Property<int?>("CentroDeCustoId");

                    b.Property<string>("Descricao")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<int>("DestinoDeUso");

                    b.Property<int>("Divisao");

                    b.Property<int>("Natureza");

                    b.Property<string>("Observacoes")
                        .HasMaxLength(250);

                    b.Property<int?>("OrdemDeInvestimentoId");

                    b.Property<string>("Planta")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<int>("Propriedade");

                    b.Property<int>("Quantidade");

                    b.Property<string>("Requisitante")
                        .HasMaxLength(50);

                    b.Property<int>("SituacaoDoAtivo");

                    b.Property<int>("SituacaoParaUso");

                    b.HasKey("Id");

                    b.HasIndex("CentroDeCustoId");

                    b.HasIndex("OrdemDeInvestimentoId");

                    b.ToTable("Ativos");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.CentroDeCusto", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("CentrosDeCusto");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.Fornecedor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("Fornecedores");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.NotaFiscal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DataDeLancamento")
                        .HasColumnType("DATETIME");

                    b.Property<int?>("FornecedorId");

                    b.Property<long>("Migo");

                    b.Property<int>("Numero");

                    b.Property<int?>("OrdemDeCompraId");

                    b.Property<double>("Valor");

                    b.HasKey("Id");

                    b.HasIndex("FornecedorId");

                    b.HasIndex("OrdemDeCompraId");

                    b.ToTable("NotasFiscais");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.OrdemDeCompra", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AtivoId");

                    b.Property<DateTime>("Data")
                        .HasColumnType("DATETIME");

                    b.Property<string>("Descricao")
                        .HasMaxLength(250);

                    b.Property<string>("Documento")
                        .IsRequired()
                        .HasMaxLength(250);

                    b.Property<long>("Numero");

                    b.Property<long>("NumeroDaRequisicao");

                    b.Property<double>("Valor");

                    b.HasKey("Id");

                    b.HasIndex("AtivoId");

                    b.ToTable("OrdensDeCompra");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.OrdemDeInvestimento", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Numero")
                        .IsRequired()
                        .HasMaxLength(7);

                    b.Property<int?>("ProjetoId");

                    b.Property<double>("Valor");

                    b.HasKey("Id");

                    b.HasIndex("ProjetoId");

                    b.ToTable("OrdensDeInvestimento");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.Projeto", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("Concluido");

                    b.Property<DateTime>("DataDeInicio")
                        .HasColumnType("DATETIME");

                    b.Property<DateTime>("DataDeTermino")
                        .HasColumnType("DATETIME");

                    b.Property<string>("Descricao")
                        .HasMaxLength(250);

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("Projetos");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.Ativo", b =>
                {
                    b.HasOne("Ferrero.GestorDeProjetos.Web.Models.CentroDeCusto", "CentroDeCusto")
                        .WithMany()
                        .HasForeignKey("CentroDeCustoId");

                    b.HasOne("Ferrero.GestorDeProjetos.Web.Models.OrdemDeInvestimento", "OrdemDeInvestimento")
                        .WithMany()
                        .HasForeignKey("OrdemDeInvestimentoId");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.NotaFiscal", b =>
                {
                    b.HasOne("Ferrero.GestorDeProjetos.Web.Models.Fornecedor", "Fornecedor")
                        .WithMany()
                        .HasForeignKey("FornecedorId");

                    b.HasOne("Ferrero.GestorDeProjetos.Web.Models.OrdemDeCompra", "OrdemDeCompra")
                        .WithMany()
                        .HasForeignKey("OrdemDeCompraId");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.OrdemDeCompra", b =>
                {
                    b.HasOne("Ferrero.GestorDeProjetos.Web.Models.Ativo", "Ativo")
                        .WithMany()
                        .HasForeignKey("AtivoId");
                });

            modelBuilder.Entity("Ferrero.GestorDeProjetos.Web.Models.OrdemDeInvestimento", b =>
                {
                    b.HasOne("Ferrero.GestorDeProjetos.Web.Models.Projeto", "Projeto")
                        .WithMany()
                        .HasForeignKey("ProjetoId");
                });
#pragma warning restore 612, 618
        }
    }
}
