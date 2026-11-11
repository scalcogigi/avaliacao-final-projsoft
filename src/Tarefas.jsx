import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

const FLASK_API_URL = "/api";
const SPRING_API_URL = "/api";

export default function Tarefas({ onNavigate }) {
  const [setTarefas] = useState([]);
  const [settarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    idMandante: "",
    idVisitante: "",
    dataTarefa: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch tarefas e Tarefas ao carregar a página
  useEffect(() => {
    fetchtarefasAndTarefas();
  }, [token]);


  const {
    user,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  useEffect(() => {
    const fetchTokenAndRoles = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);

        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const roles = payload["https://social-insper.com/roles"] || [];
        setIsAdmin(roles.includes("ADMIN"));
      } catch (e) {
        console.error("Erro ao buscar token:", e);
      }
    };

    if (isAuthenticated) {
      fetchTokenAndRoles();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const fetchtarefasAndTarefas = async () => {
    try {
      setLoading(true);
      setError("");

      // Buscar tarefas
      const tarefasResponse = await fetch(`${FLASK_API_URL}/tarefas`);
      if (!tarefasResponse.ok) {
        throw new Error("Erro ao buscar tarefas");
      }
      const tarefasData = await tarefasResponse.json();
      settarefas(tarefasData);

      // Buscar Tarefas
      const TarefasResponse = await fetch(`${SPRING_API_URL}/Tarefas`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!TarefasResponse.ok) {
        throw new Error("Erro ao buscar Tarefas");
      }
      const TarefasData = await TarefasResponse.json();
      setTarefas(TarefasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idMandante || !formData.idVisitante || !formData.dataTarefa) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (formData.idMandante === formData.idVisitante) {
      setError("O tarefa mandante e visitante não podem ser o mesmo");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Converter data para formato ISO 8601 com hora
      const dataTarefa = new Date(formData.dataTarefa).toISOString();

      const response = await fetch(`${SPRING_API_URL}/Tarefas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idMandante: formData.idMandante,
          idVisitante: formData.idVisitante,
          dataTarefa: dataTarefa,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar Tarefa");
      }

      const newTarefa = await response.json();
      setTarefas((prev) => [...prev, newTarefas]);
      setFormData({ idMandante: "", idVisitante: "", dataTarefa: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const gettarefaNome = (tarefaId) => {
    const tarefa = tarefas.find((t) => t.id === tarefaId);
    return tarefa ? tarefa.nome : "tarefa não encontrado";
  };

  const formatarData = (dataString) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleString("pt-BR");
    } catch {
      return dataString;
    }
  };

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Menu */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => onNavigate("home")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate("tarefas")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Tarefas
            </button>
          </nav>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gerenciar Tarefas</h1>
          <LogoutButton />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Criar Nova Tarefa</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="idMandante" className="block text-sm font-medium text-gray-700 mb-1">
                tarefa Mandante
              </label>
              <select
                id="idMandante"
                name="idMandante"
                value={formData.idMandante}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um tarefa</option>
                {tarefas.map((tarefa) => (
                  <option key={tarefa.id} value={tarefa.id}>
                    {tarefa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="idVisitante" className="block text-sm font-medium text-gray-700 mb-1">
                tarefa Visitante
              </label>
              <select
                id="idVisitante"
                name="idVisitante"
                value={formData.idVisitante}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um tarefa</option>
                {tarefas.map((tarefa) => (
                  <option key={tarefa.id} value={tarefa.id}>
                    {tarefa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dataTarefa" className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora da Tarefa
              </label>
              <input
                type="datetarefa-local"
                id="dataTarefa"
                name="dataTarefa"
                value={formData.dataTarefa}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || tarefas.length === 0}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
            >
              {submitting ? "Criando..." : "Criar Tarefa"}
            </button>
          </form>
        </div>

        {/* Tarefas List Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Tarefas Cadastradas</h2>

          {loading ? (
            <p className="text-gray-600">Carregando Tarefas...</p>
          ) : Tarefas.length === 0 ? (
            <p className="text-gray-600">Nenhuma Tarefa cadastrada ainda.</p>
          ) : (
            <div className="grid gap-4">
              {Tarefas.map((Tarefa) => (
                <div
                  key={Tarefa.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {gettarefaNome(Tarefa.idMandante)} vs{" "}
                      {gettarefaNome(Tarefa.idVisitante)}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium">Data e Hora:</span>{" "}
                    {formatarData(Tarefa.dataTarefa)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
