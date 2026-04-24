"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Regalo } from "@/src/types";

export default function BabyshowerAurora() {
  const [pantallaActual, setPantallaActual] = useState(1);
  const [nombre, setNombre] = useState("");
  const [regaloSeleccionado, setRegaloSeleccionado] = useState<number | null>(null);
  const [regaloNombre, setRegaloNombre] = useState("");
  const [regalos, setRegalos] = useState<Regalo[]>([]);
  const [regalosReservados, setRegalosReservados] = useState<number[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoRegalos, setCargandoRegalos] = useState(true);
  const [modal, setModal] = useState<string | null>(null);

  useEffect(() => {
    async function cargarRegalos() {
      try {
        const [resRegalos, resInvitados] = await Promise.all([
          fetch("/api/regalo"),
          fetch("/api/invitados"),
        ]);

        if (resRegalos.ok) {
          const data = await resRegalos.json();
          setRegalos(data);
        }

        if (resInvitados.ok) {
          const invitados = await resInvitados.json();
          const reservados = invitados.map((inv: { regaloId: number }) => inv.regaloId);
          setRegalosReservados(reservados);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargandoRegalos(false);
      }
    }
    cargarRegalos();
  }, []);

  const lanzarConfeti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#f06292", "#ce93d8", "#81d4fa", "#fff176", "#a5d6a7"] });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 } }), 300);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 } }), 500);
  };

  const irPantallaRegalos = () => {
    if (nombre.trim() === "") {
      setModal("Por favor, dinos tu nombre antes de entrar.");
      return;
    }
    setPantallaActual(2);
  };

  const irPantallaDespedida = async () => {
    if (!regaloSeleccionado) {
      setModal("Por favor, selecciona un regalito de la lista.");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("/api/invitados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, regaloId: regaloSeleccionado }),
      });
      const resultado = await res.json();

      if (resultado.success) {
        setPantallaActual(3);
        setTimeout(lanzarConfeti, 300);
      } else {
        setModal(resultado.error || "Hubo un error al guardar tu elección.");
      }
    } catch (error) {
      setModal("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const regalosDisponibles = regalos.filter(r => !regalosReservados.includes(r.id)).length;

  const variantes = {
    entrada: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    salida: { opacity: 0, y: -30, transition: { duration: 0.3 } },
  };

  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>

      <div className="personaje-esquina">
        <Image src="/plimplim_deco.png" alt="Animando" width={220} height={220} />
      </div>

      <AnimatePresence mode="wait">

        {/* pantalla 1*/}
        {pantallaActual === 1 && (
          <motion.div
            key="pantalla1"
            className="container"
            variants={variantes}
            initial="entrada"
            animate="visible"
            exit="salida"
          >
            <div className="personaje-flotante" style={{ top: "-110px", left: "50%", transform: "translateX(-50%)", marginLeft: "-75px" }}>
              <Image src="/plimplim_1.png" alt="Sentado" width={150} height={150} />
            </div>

            <div className="icono">🍼✨</div>
            <h1>Cumpleaños de Aurora</h1>
            <p style={{ color: "#757575" }}>¡Bienvenido a un cumpleaños mágico!</p>
            <input
              type="text"
              placeholder="Escribe tu nombre aquí..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && irPantallaRegalos()}
            />
            <br />
            <motion.button
              className="btn"
              onClick={irPantallaRegalos}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Entrar
            </motion.button>
          </motion.div>
        )}

        {/* pantalla 2*/}
        {pantallaActual === 2 && (
          <motion.div
            key="pantalla2"
            className="container ancho"
            variants={variantes}
            initial="entrada"
            animate="visible"
            exit="salida"
          >
            <div className="personaje-flotante" style={{ top: "-110px", left: "50%", transform: "translateX(-50%)", marginLeft: "-75px" }}>
              <Image src="/plimplim.png" alt="Guiño" width={150} height={150} />
            </div>

            <div className="icono">🎁</div>
            <h1>Lista de Regalos</h1>
            <p style={{ fontWeight: "bold", fontSize: "20px", color: "#1E88E5" }}>¡Hola {nombre}!</p>
            <p style={{ color: "#757575" }}>¿Qué te gustaría regalarle a Aurora?</p>

            {!cargandoRegalos && (
              <p style={{ fontSize: "13px", color: "#E91E63", fontWeight: "bold", margin: "4px 0 12px" }}>
                🎀 {regalosDisponibles} de {regalos.length} regalos disponibles
              </p>
            )}

            <div className="opciones">
              {cargandoRegalos ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="regalo-item"
                    style={{
                      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.4s infinite",
                      height: "44px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                  ></div>
                ))
              ) : (
                regalos.map((r) => {
                  const reservado = regalosReservados.includes(r.id);
                  return (
                    <label
                      key={r.id}
                      className="regalo-item"
                      style={{ opacity: reservado ? 0.45 : 1, cursor: reservado ? "not-allowed" : "pointer" }}
                    >
                      <input
                        type="radio"
                        name="regalo"
                        value={r.id}
                        disabled={reservado}
                        onChange={() => {
                          setRegaloSeleccionado(r.id);
                          setRegaloNombre(r.nombre);
                        }}
                        style={{ marginRight: "10px", transform: "scale(1.2)" }}
                      />
                      <span>
                        {reservado && <span style={{ marginRight: "6px" }}>🔒</span>}
                        {r.nombre}
                        {r.descripcion && <span style={{ color: "#9E9E9E", fontSize: "13px" }}> — {r.descripcion}</span>}
                        {r.precio && <span style={{ color: "#E91E63", fontSize: "13px", fontWeight: "bold" }}> ({r.precio})</span>}
                        {reservado && <span style={{ color: "#9E9E9E", fontSize: "12px", marginLeft: "6px" }}>Ya reservado</span>}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            <button className="btn" onClick={irPantallaDespedida} disabled={cargando}>
              {cargando ? "Enviando..." : "Elegir y Enviar"}
            </button>
          </motion.div>
        )}

        {/* pantalla 3*/}
        {pantallaActual === 3 && (
          <motion.div
            key="pantalla3"
            className="container"
            variants={variantes}
            initial="entrada"
            animate="visible"
            exit="salida"
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
              <Image
                src="/plim_plim_ty.jpg"
                alt="Gracias"
                width={280}
                height={170}
                style={{ borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              />
            </div>
            <h1 style={{ color: "#4CAF50" }}>¡Muchas Gracias!</h1>
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>Tu elección: {regaloNombre}</p>
            <p style={{ color: "#757575" }}>¡Nos vemos en el cumpleaños para celebrar!</p>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Modal bonito */}
      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setModal(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "36px 32px",
              maxWidth: "340px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎀</div>
            <p style={{ fontSize: "17px", color: "#555", marginBottom: "24px", lineHeight: "1.5" }}>
              {modal}
            </p>
            <button
              className="btn"
              onClick={() => setModal(null)}
              style={{ width: "100%" }}
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}

      <div className="onda-contenedor">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
            fill="#F48FB1"
            fillOpacity="0.3"
          />
          <path
            d="M0,80 C480,20 960,100 1440,40 L1440,120 L0,120 Z"
            fill="#CE93D8"
            fillOpacity="0.2"
          />
          <path
            d="M0,100 C300,60 1140,110 1440,80 L1440,120 L0,120 Z"
            fill="#F48FB1"
            fillOpacity="0.15"
          />
        </svg>
      </div>

    </div>
  );
}