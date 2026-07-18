import { Card, InputNumber, Radio, Select, Space } from "antd";

export default function FiltersBar({ options, filters, onChange, ranking, onRankingChange }) {
  const selectOptions = (values) => (values ?? []).map((v) => ({ value: v, label: v }));

  const set = (key) => (value) =>
    onChange({ ...filters, [key]: value && value.length !== 0 ? value : undefined });

  const multiProps = {
    mode: "multiple",
    allowClear: true,
    maxTagCount: "responsive",
    showSearch: true,
  };

  return (
    <Card size="small" styles={{ body: { padding: 14 } }}>
      <Space wrap>
        <Select
          {...multiProps}
          placeholder="Session"
          style={{ minWidth: 160 }}
          value={filters.session}
          options={selectOptions(options?.sessions)}
          onChange={set("session")}
        />
        <Select
          {...multiProps}
          placeholder="City"
          style={{ minWidth: 140 }}
          value={filters.city}
          options={selectOptions(options?.cities)}
          onChange={set("city")}
        />
        <Select
          {...multiProps}
          placeholder="Board"
          style={{ minWidth: 140 }}
          value={filters.board}
          options={selectOptions(options?.boards)}
          onChange={set("board")}
        />
        <Select
          {...multiProps}
          placeholder="Campus"
          style={{ minWidth: 220 }}
          value={filters.campus}
          options={selectOptions(options?.campuses)}
          onChange={set("campus")}
        />
        <Select
          {...multiProps}
          placeholder="Grade"
          style={{ minWidth: 120 }}
          value={filters.grade}
          options={selectOptions(options?.grades)}
          onChange={set("grade")}
        />
        <InputNumber
          placeholder="Min %"
          min={0}
          max={100}
          style={{ width: 90 }}
          value={filters.min_percentage}
          onChange={set("min_percentage")}
        />
        <InputNumber
          placeholder="Max %"
          min={0}
          max={100}
          style={{ width: 90 }}
          value={filters.max_percentage}
          onChange={set("max_percentage")}
        />
        <Radio.Group
          value={ranking.mode}
          onChange={(e) => onRankingChange({ ...ranking, mode: e.target.value })}
          options={[
            { label: "Top", value: "top" },
            { label: "Lowest", value: "bottom" },
          ]}
          optionType="button"
        />
        <InputNumber
          min={1}
          max={100}
          value={ranking.count}
          onChange={(v) => onRankingChange({ ...ranking, count: v || 10 })}
          addonAfter="students"
          style={{ width: 140 }}
        />
      </Space>
    </Card>
  );
}
