import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Segmented, Table, Select, message, Button, Popover } from 'antd';
import useCareerDict from '@/hooks/CareerDict';
import useSystemDict from '@/hooks/useSystemDict';
import manageApi from '@/api/manage';
import knowledgeApi from '@/api/knowledge';

// A new component for the editing form inside the Popover
const EditCellForm = ({ cellData, careerDicts, suitabilityOptions, onSave, onCancel }) => {
  const [suitability, setSuitability] = useState(cellData.suitability);
  const [resultCareerValue, setResultCareerValue] = useState(cellData.resultCareerValue);

  const handleConfirm = () => {
    onSave({
      suitability,
      resultCareerValue,
    });
  };

  return (
    <div style={{ width: 200 }}>
      <Select
        placeholder="适配性"
        value={suitability}
        onChange={value => setSuitability(value)}
        style={{ width: '100%', marginBottom: 8 }}
        options={suitabilityOptions}
        allowClear
      />
      <Select
        showSearch
        placeholder="选择结果职业"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        options={careerDicts}
        value={resultCareerValue}
        onChange={value => setResultCareerValue(value)}
        style={{ width: '100%', marginBottom: 8 }}
        allowClear
      />
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} size="small" style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleConfirm} type="primary" size="small">
          确定
        </Button>
      </div>
    </div>
  );
};


const Match = () => {
  const birthTableOptions = useSystemDict('birthTable');
  const suitabilityOptions = useSystemDict('suitability');
  const [currentTable, setCurrentTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const careerDicts = useCareerDict();
  const [visiblePopoverKey, setVisiblePopoverKey] = useState(null);
  const [uniqueACareers, setUniqueACareers] = useState([]);

  useEffect(() => {
    if (birthTableOptions.length > 0 && !currentTable) {
      setCurrentTable(birthTableOptions[0].value);
    }
  }, [birthTableOptions, currentTable]);

  const handleSave = useCallback(async (cellData, aCareerName, bCareerName) => {
    setLoading(true);
    try {
      const aCareerId = careerDicts.find(c => c.label === aCareerName)?.value;
      const bCareerId = careerDicts.find(c => c.label === bCareerName)?.value;
      const suitabilityLabel = suitabilityOptions.find(s => s.label === cellData.suitability)?.value || cellData.suitability;

      const payload = {
        birthId: parseInt(cellData.birthId) || null,
        birthTable: parseInt(currentTable) || null,
        careerIdA: aCareerId,
        careerIdB: bCareerId,
        suitability: suitabilityLabel || null,
        birthCareerId: cellData.resultCareerValue || null,
      };

      await manageApi.career.match.save(payload);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败，A：' +  careerDicts.find(c => c.label === aCareerName)?.value + '，B：' + careerDicts.find(c => c.label === bCareerName)?.value);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentTable, careerDicts, suitabilityOptions]);

  const handleCellEditAndSave = useCallback((rowKey, colKey, newData) => {
    let updatedCellData;
    setTableData(currentData => {
      const newTableData = currentData.map(row => {
        if (row.key === rowKey) {
          updatedCellData = {
            ...row[colKey],
            suitability: newData.suitability,
            resultCareerValue: newData.resultCareerValue,
          };
          return {
            ...row,
            [colKey]: updatedCellData,
          };
        }
        return row;
      });
      if (updatedCellData) {
        handleSave(updatedCellData, colKey, rowKey);
      }
      return newTableData;
    });
    setVisiblePopoverKey(null);
  }, [handleSave]);

  const columns = useMemo(() => [
    {
      title: '↓ 竖 \\ 横 →',
      dataIndex: 'rowHeader',
      key: 'rowHeader',
      render: (text) => <strong>{text}</strong>
    },
    ...uniqueACareers.map(aCareer => ({
      title: aCareer,
      dataIndex: aCareer,
      key: aCareer,
      onCell: (record) => {
        const cellData = record[aCareer];
        const suitabilityLabel = suitabilityOptions.find(s => s.value === cellData?.suitability)?.label || cellData?.suitability;
        const suitabilityColorMap = {
          'A': '#d9f7be', // light green
          'B': '#bae0ff', // light blue
          'C': '#ffe7ba', // light orange
          'D': '#ffccc7', // light red
          'E': '#f5f5f5', // light grey
        };
        const backgroundColor = suitabilityColorMap[suitabilityLabel] || 'inherit';
        return {
          style: { backgroundColor },
        };
      },
      render: (cellData, record) => {
        const bCareer = record.rowHeader;
        const popoverKey = `${bCareer}-${aCareer}`;
        const resultCareerLabel = careerDicts.find(c => c.value === cellData?.resultCareerValue)?.label;
        const suitabilityLabel = suitabilityOptions.find(s => s.value === cellData?.suitability)?.label || cellData?.suitability;

        const displayText = `${suitabilityLabel || '-'}/${resultCareerLabel || '-'}`;

        return (
          <Popover
            content={
              <EditCellForm
                cellData={cellData}
                careerDicts={careerDicts}
                suitabilityOptions={suitabilityOptions}
                onSave={(newData) => handleCellEditAndSave(bCareer, aCareer, newData)}
                onCancel={() => setVisiblePopoverKey(null)}
              />
            }
            title="编辑单元格"
            trigger="click"
            open={visiblePopoverKey === popoverKey}
            onOpenChange={(open) => setVisiblePopoverKey(open ? popoverKey : null)}
          >
            <div role="button" tabIndex={0} style={{ cursor: 'pointer', padding: '5px' }}>{displayText}</div>
          </Popover>
        );
      },
    })),
  ], [uniqueACareers, careerDicts, suitabilityOptions, visiblePopoverKey, handleCellEditAndSave]);

  const fetchData = useCallback(async () => {
    if (!currentTable || careerDicts.length === 0 || suitabilityOptions.length === 0) return;

    setLoading(true);
    try {
      const res = await knowledgeApi.birth.queryPage({ birthTable: currentTable });
      const matchData = res.data.data;

      const newUniqueACareers = [...new Set(matchData.map(item => item.birthACareer))].sort();
      const newUniqueBCareers = [...new Set(matchData.map(item => item.birthBCareer))].sort();
      setUniqueACareers(newUniqueACareers);

      const matchMap = new Map();
      matchData.forEach(item => {
        const key = `${item.birthACareer}-${item.birthBCareer}`;
        matchMap.set(key, item);
      });

      const initialData = newUniqueBCareers.map(bCareer => {
        const row = { key: bCareer, rowHeader: bCareer };
        newUniqueACareers.forEach(aCareer => {
          const match = matchMap.get(`${aCareer}-${bCareer}`);
          const resultCareer = careerDicts.find(c => c.label === match?.birthCareer);
          row[aCareer] = {
            suitability: match ? match.suitability : '',
            resultCareerValue: resultCareer ? resultCareer.value : null,
            birthId: match ? match.birthId : null,
          };
        });
        return row;
      });
      setTableData(initialData);

    } catch (error) {
      message.error('获取数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentTable, careerDicts, suitabilityOptions]);

  useEffect(() => {
    if (currentTable && careerDicts.length > 0 && suitabilityOptions.length > 0) {
        fetchData();
    }
  }, [currentTable, careerDicts, suitabilityOptions, fetchData]);

  return (
    <div>
      <Segmented
        options={birthTableOptions}
        value={currentTable}
        onChange={setCurrentTable}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={tableData}
        bordered
        size="middle"
        pagination={false}
        loading={loading}
        tableLayout="fixed"
      />
    </div>
  );
};

export default Match;
