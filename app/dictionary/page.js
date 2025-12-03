"use client";

import { useEffect, useMemo, useState } from "react";
import { Landmark, Zap, Dumbbell, ClipboardList, Cog, Dna } from "lucide-react";

import DCM from "../../components/dictionary/dCM.js";
import Search from "../../components/global/search.js";
import Alphabet from "../../components/dictionary/alphabetSeperator.js";

export default function Dictionary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/entries");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  const groupedByLetter = useMemo(() => {

    let processed = entries.map((e) => {
      const letter = (e.letter || e.title?.[0] || "#").toString().toUpperCase();
      return {
        id: e._id?.toString?.() ?? e._id ?? e.title,
        title: e.title,
        category: e.category,
        sub: e.type,
        gist: e.gist,
        definition: e.definition || "",
        iconName: e.icon || "Landmark",
        letter,
      };
    });

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      processed = processed.filter((item) => {
        return (
          item.title?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    processed = processed
      .filter((e) => e.letter)
      .sort((a, b) => {
        if (a.letter === b.letter) {
          return a.title.localeCompare(b.title);
        }
        return a.letter.localeCompare(b.letter);
      });

    const grouped = processed.reduce((acc, entry) => {
      if (!acc[entry.letter]) acc[entry.letter] = [];
      acc[entry.letter].push(entry);
      return acc;
    }, {});

    return grouped;
  }, [entries, searchQuery]);

  function renderIcon(iconName) {
    switch (iconName) {
      case "Landmark": return <Landmark />;
      case "ClipboardList": return <ClipboardList />;
      case "Dumbbell": return <Dumbbell />;
      case "Zap": return <Zap />;
      case "Cog": return <Cog />;
      case "Dna": return <Dna />;
      default: return <Landmark />;
    }
  }

  const totalVisible = Object.values(groupedByLetter).reduce((acc, list) => acc + list.length, 0);

  return (
    <div>
      <main className="w-full h-full">
        <div className="flex flex-col mb-6">

          <Search 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search dictionary..." 
          />
          <div className="w-full h-[1px] bg-brand-grey3" />
        </div>

        {loading && <p className="text-xs text-brand-grey4">Loading entries…</p>}
        {!loading && errorMsg && <p className="text-xs text-red-500">Error: {errorMsg}</p>}

        {!loading && !errorMsg && (
          <div className="flex flex-col gap-6">
            {Object.entries(groupedByLetter).map(([letter, list]) => (
              <section key={letter}>
                <Alphabet letter={letter} />
                <div className="flex flex-col gap-4 mt-2">
                  {list.map((entry) => (
                    <DCM
                      key={entry.id}
                      title={entry.title}
                      category={entry.category}
                      sub={entry.sub}
                      gist={entry.gist}
                      definition={entry.definition}
                      icon={renderIcon(entry.iconName)}
                    />
                  ))}
                </div>
              </section>
            ))}

            {entries.length > 0 && totalVisible === 0 && (
              <p className="text-xs text-brand-grey4 text-center">
                No matches found for "{searchQuery}"
              </p>
            )}

            {entries.length === 0 && (
              <p className="text-xs text-brand-grey4">No entries found.</p>
            )}
          </div>
        )}
      </main>
      
    </div>
  );
}