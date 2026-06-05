const TreeNode = ({ node }) => (
  <li>
    <div className="tree-node">
      <strong>{node.name}</strong>
      <span>{node.referralCode}</span>
    </div>
    {node.children?.length > 0 && (
      <ul>
        {node.children.map((child) => (
          <TreeNode node={child} key={child.id} />
        ))}
      </ul>
    )}
  </li>
);

const ReferralTree = ({ tree }) => {
  if (!tree) {
    return <p className="empty-state">Referral tree is not available yet.</p>;
  }

  return (
    <div className="tree-wrap">
      <ul className="referral-tree">
        <TreeNode node={tree} />
      </ul>
    </div>
  );
};

export default ReferralTree;
